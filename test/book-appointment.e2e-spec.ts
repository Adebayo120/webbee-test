import { INestApplication } from '@nestjs/common';
import { TestManager } from './helpers/test-manager.helper';
import * as moment from 'moment';
import factory from './../src/factories/factory.helper';
import { ProfileInput } from '../src/modules/appointment/dtos/profile.input';
import { ProfileInputFactory } from './../src/factories/entities/profile-input.factory';
import { Request } from './helpers/test-request.helper';
import { faker } from '@faker-js/faker';

describe('Book appointment mutation', () => {
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
      const response = await request.bookAppointment({
        serviceId: serviceId + 100,
        startDate: moment().toISOString(),
        profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when start date is not a date iso string', async () => {
      const response = await request.bookAppointment({
        serviceId,
        startDate: moment().format(),
        profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when any profile email is not a valid email', async () => {
      const response = await request.bookAppointment({
        serviceId,
        startDate: moment().toISOString(),
        profiles: [
          factory<ProfileInput>(ProfileInputFactory, {
            email: faker.person.firstName(),
          }).make(),
        ],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when appointment datetime is in the past ', async () => {
      const response = await request.bookAppointment({
        serviceId,
        startDate: moment().subtract(3, 'd').toISOString(),
        profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when appointment datet falls on planned off day', async () => {
      const response = await request.bookAppointment({
        serviceId,
        startDate: moment().add(3, 'd').toISOString(),
        profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('when appointment day is unavailable', async () => {
      const unavailableDay =
        moment().day() === 0 ? moment() : moment().startOf('w').add(1, 'w');

      const response = await request.bookAppointment({
        serviceId,
        startDate: unavailableDay.toISOString(),
        profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      });

      expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    describe('given request day is available', () => {
      let availableDay: moment.Moment;
      beforeAll(() => {
        availableDay =
          moment().add(1, 'd').day() === 0
            ? moment().add(2, 'd')
            : moment().add(1, 'd');
      });

      it('when business does not operate on appointment time', async () => {
        const response = await request.bookAppointment({
          serviceId,
          startDate: availableDay.startOf('d').add(360, 'm').toISOString(),
          profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
        });

        expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
      });

      it('when request slot is over bookable slot count', async () => {
        const response = await request.bookAppointment({
          serviceId,
          startDate: availableDay.toISOString(),
          profiles: [
            factory<ProfileInput>(ProfileInputFactory).make(),
            factory<ProfileInput>(ProfileInputFactory).make(),
            factory<ProfileInput>(ProfileInputFactory).make(),
            factory<ProfileInput>(ProfileInputFactory).make(),
          ],
        });

        expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
      });

      it('when request datetime falls on configured break', async () => {
        const response = await request.bookAppointment({
          serviceId,
          startDate: availableDay.startOf('day').add(720, 'm').toISOString(),
          profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
        });

        expect(response.errors[0].extensions.code).toBe('BAD_REQUEST');
      });
    });
  });

  it('books appointment when request meets all conditions', async () => {
    const availableDay =
      moment().add(1, 'd').day() === 0
        ? moment().add(2, 'd')
        : moment().add(1, 'd');

    const startDateMinute = availableDay.day() === 6 ? 600 : 480;

    const availableSlot = availableDay.startOf('day').add(startDateMinute, 'm');

    const profile = factory<ProfileInput>(ProfileInputFactory).make();

    const response = await request.bookAppointment({
      serviceId,
      startDate: availableSlot.toISOString(),
      profiles: [profile],
    });

    const data = response.data.bookAppointment;

    expect(data).toHaveLength(1);
    expect(data).toContainEqual({
      ...profile,
      startDate: availableSlot.format(),
      endDate: availableSlot.add(10, 'm').format(),
    });
  });
});
