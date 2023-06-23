import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { Service } from 'src/service/service.entity';
import { ConfiguredBreak } from 'src/configured-break/configured-break.entity';

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

const configuredBreak: ConfiguredBreak = {
  id: 1,
  name: 'lunch break',
  startHourInMinutes: 720,
  endHourInMinutes: 780,
  service,
};

describe('PlannedOff Helper', () => {
  let helper: ConfiguredBreakHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguredBreakHelper],
    }).compile();

    helper = module.get<ConfiguredBreakHelper>(ConfiguredBreakHelper);
  });

  it('Should be able to determine if input fall on break time', () => {
    service.configuredBreaks = [configuredBreak];
    expect(
      helper.forService(service).whereBetweenHours(750, 760).exists(),
    ).toBeTruthy();
  });

  it('Can get first break that clashes with input time', () => {
    service.configuredBreaks = [configuredBreak];
    expect(helper.forService(service).whereBetweenHours(750, 760).first()).toBe(
      configuredBreak,
    );
  });

  it('Can get sum of breaks hours between input', () => {
    service.configuredBreaks = [configuredBreak];
    expect(
      helper
        .forService(service)
        .whereBetweenHours(750, 760)
        .sumOfHoursInMinutes(),
    ).toBe(60);
  });

  it('Can check that break start hour is equal to input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .startHourInMinutesIsEqual(configuredBreak.startHourInMinutes),
    ).toBeTruthy();
  });

  it('Can check that break start hour is less than input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .startHourInMinutesIsLessThan(configuredBreak.startHourInMinutes + 1),
    ).toBeTruthy();
  });

  it('Can check that break start hour is greater than input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .startHourInMinutesIsGreaterThan(
          configuredBreak.startHourInMinutes - 1,
        ),
    ).toBeTruthy();
  });

  it('Can check that break end hour is equal to input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .endHourInMinutesIsEqual(configuredBreak.endHourInMinutes),
    ).toBeTruthy();
  });

  it('Can check that break end hour is less than input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .endHourInMinutesIsLessThan(configuredBreak.endHourInMinutes + 1),
    ).toBeTruthy();
  });

  it('Can check that break end hour is greater than input', () => {
    expect(
      helper
        .forBreak(configuredBreak)
        .endHourInMinutesIsGreaterThan(configuredBreak.endHourInMinutes - 1),
    ).toBeTruthy();
  });
});
