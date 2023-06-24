import { Test, TestingModule } from '@nestjs/testing';
import { PlannedOffHelper } from './planned-off.helper';
import { Service } from './../service/service.entity';
import * as moment from 'moment';
import { PlannedOff } from './../planned-off/planned-off.entity';

const service: Service = {
  id: 1,
  name: 'Men Haircut',
  businessAdministrator: {
    id: 1,
    name: 'Hair Saloon',
    services: [],
  },
  bookableDurationInMinutes: 10,
  breakBetweenSlotsInMinutes: 5,
  futureBookableDays: 7,
  bookableAppointmentsPerSlotCount: 3,
  bookableCalenders: [],
  configuredBreaks: [],
  plannedOffs: [],
  appointments: [],
};

const plannedOff: PlannedOff = {
  id: 1,
  startDate: moment().startOf('day').add(480, 'm').format(),
  endDate: moment().startOf('day').add(600, 'm').format(),
  service,
};

describe('PlannedOff Helper', () => {
  let helper: PlannedOffHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlannedOffHelper],
    }).compile();

    helper = module.get<PlannedOffHelper>(PlannedOffHelper);
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });

  it('should be able to figure out that plannedOffs exists between dates', () => {
    service.plannedOffs = [plannedOff];
    expect(
      helper
        .forService(service)
        .whereBetween(
          moment().startOf('day').add(500, 'm'),
          moment().startOf('day').add(550, 'm'),
        )
        .exists(),
    ).toBeTruthy();
  });

  it('should be able to figure out that theres no plannedOffs between dates', () => {
    service.plannedOffs = [];
    expect(
      helper
        .forService(service)
        .whereBetween(
          moment().startOf('day').add(500, 'm'),
          moment().startOf('day').add(550, 'm'),
        )
        .exists(),
    ).toBeFalsy();
  });

  it('should be compare if start date is equal to input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .startDateIsEqual(moment(plannedOff.startDate)),
    ).toBeTruthy();
  });

  it('should be compare if start date is before input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .startDateIsBefore(moment(plannedOff.startDate).add(1, 'd')),
    ).toBeTruthy();
  });

  it('should be compare if start date is after input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .startDateIsAfter(moment(plannedOff.startDate).subtract(1, 'day')),
    ).toBeTruthy();
  });

  it('should be compare if end date is equal to input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .endDateIsEqual(moment(plannedOff.endDate)),
    ).toBeTruthy();
  });

  it('should be compare if end date is before input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .endDateIsBefore(moment(plannedOff.endDate).add(1, 'd')),
    ).toBeTruthy();
  });

  it('should be compare if end date is after input', () => {
    expect(
      helper
        .forPlannedOff(plannedOff)
        .endDateIsAfter(moment(plannedOff.endDate).subtract(1, 'day')),
    ).toBeTruthy();
  });
});
