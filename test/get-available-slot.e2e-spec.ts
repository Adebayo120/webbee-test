import { INestApplication } from '@nestjs/common';
import { TestManager } from './helpers/test-manager.helper';
import { Slot } from './../src/slot/object-types/slot.type';
import * as moment from 'moment';
import factory from './../src/factories/factory.helper';
import { ProfileInput } from './../src/appointment/dtos/profile.input';
import { ProfileInputFactory } from './../src/factories/entities/profile-input.factory';
import { Request } from './helpers/test-request.helper';

describe('Get available slots query', () => {
  let app: INestApplication;
  let serviceId: number;
  let request: Request;

  beforeAll(async () => {
    const testManager: TestManager = await global.testManager.initApp();

    app = testManager.getApp();

    serviceId = testManager.getServiceId();

    request = new Request().make(app);
  });

  describe('return bad request ', () => {
    it('when service id is invalid', async () => {
      const response = await request.availableSlots({
        serviceId: serviceId + 100,
        startDateString: moment().toISOString(),
        endDateString: moment().add(1, 'd').toISOString(),
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when date range is not correct', async () => {
      const response = await request.availableSlots({
        serviceId,
        startDateString: moment().add(1, 'd').toISOString(),
        endDateString: moment().toISOString(),
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });

  describe('when valid request data is sent', () => {
    describe('when date range is in the past', () => {
      it('returns empty response', async () => {
        const response = await request.availableSlots({
          serviceId,
          startDateString: moment().subtract(3, 'd').toISOString(),
          endDateString: moment().subtract(2, 'd').toISOString(),
        });

        const data = response.data.availableSlots;

        expect(data.availableDates).toHaveLength(0);
        expect(data.availableSlots).toHaveLength(0);
      });
    });

    describe('when date range is correct', () => {
      let slot: Slot;
      beforeAll(async () => {
        const response = await request.availableSlots({
          serviceId,
          startDateString: moment().toISOString(),
          endDateString: moment().add(7, 'd').toISOString(),
        });

        slot = response.data.availableSlots;
      });

      it('does not return date that falls on pannedOff', () => {
        expect(slot.availableDates).not.toContain(
          moment().add(3, 'd').format('dddd, MMMM Do YYYY'),
        );
      });

      it('does not return date that falls on days that are not available', () => {
        const unavailableDay =
          moment().day() === 0 ? moment() : moment().startOf('w').add(1, 'w');

        expect(slot.availableDates).not.toContain(
          unavailableDay.format('dddd, MMMM Do YYYY'),
        );
      });

      it('does not return slots that falls on configured break', () => {
        const availableDay =
          moment().add(1, 'd').day() === 0
            ? moment().add(2, 'd')
            : moment().add(1, 'd');

        expect(slot.availableSlots).not.toContain({
          startDate: availableDay.startOf('day').add(720, 'm'),
          bookableAppointmentsCount: 3,
        });
      });

      it('return available slots', () => {
        const availableDay =
          moment().add(1, 'd').day() === 0
            ? moment().add(2, 'd')
            : moment().add(1, 'd');

        const startDateMinute = availableDay.day() === 6 ? 600 : 480;

        expect(slot.availableSlots).toContainEqual({
          startDate: availableDay
            .startOf('day')
            .add(startDateMinute, 'm')
            .format('dddd, MMMM Do YYYY, h:mm:ss a'),
          bookableAppointmentsCount: 3,
        });
      });

      it('updates available slots bookable appointment count', async () => {
        const availableDay =
          moment().add(1, 'd').day() === 0
            ? moment().add(2, 'd')
            : moment().add(1, 'd');

        const startDateMinute = availableDay.day() === 6 ? 600 : 480;

        const availableSlot = availableDay
          .startOf('day')
          .add(startDateMinute, 'm');

        await request.bookAppointment({
          serviceId,
          startDate: availableSlot.toISOString(),
          profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
        });

        expect(slot.availableSlots).not.toContainEqual({
          startDate: availableSlot.format('dddd, MMMM Do YYYY, h:mm:ss a'),
          bookableAppointmentsCount: 2,
        });
      });
    });
  });
});
