import { Service } from '../modules/service/service.entity';
import { ServiceHelper } from './service.helper';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';

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

describe('PlannedOff Helper', () => {
  let helper: ServiceHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceHelper],
    }).compile();

    helper = module.get<ServiceHelper>(ServiceHelper);
  });

  it('can check if service has a future bookable day limit', function () {
    expect(helper.forService(service).hasFutureBookableDayLimit()).toBeTruthy();
  });

  it('can check if service does not have future bookable day limit', function () {
    service.futureBookableDays = null;
    expect(helper.forService(service).hasFutureBookableDayLimit()).toBeFalsy();
  });

  it('can generate service future bookable day limit', function () {
    service.futureBookableDays = null;
    expect(helper.forService(service).futureBookableDate().format()).toBe(
      moment().add(service.futureBookableDays, 'day').endOf('day').format(),
    );
  });

  it('can check future bookable date is greater than or equal input', function () {
    const daysCount = 11;
    service.futureBookableDays = daysCount;
    expect(helper.forService(service).futureBookableDate().format()).toBe(
      moment().add(daysCount, 'day').endOf('day').format(),
    );
  });

  it('can check future bookable date is greater than or equal input', function () {
    const daysCount = 11;
    service.futureBookableDays = daysCount;
    expect(
      helper.forService(service).futureBookableDateIsSameOrAfter(moment()),
    ).toBeTruthy();
  });
});
