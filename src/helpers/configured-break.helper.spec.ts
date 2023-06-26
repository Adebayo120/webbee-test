import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { Service } from '../modules/service/service.entity';
import { ConfiguredBreak } from '../modules/configured-break/configured-break.entity';
import factory from './../factories/factory.helper';
import { ConfiguredBreakFactory } from './../factories/entities/configured-break.factory';

describe('PlannedOff Helper', () => {
  let helper: ConfiguredBreakHelper;
  let service: Service;
  let configuredBreak: ConfiguredBreak;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguredBreakHelper],
    }).compile();

    helper = module.get<ConfiguredBreakHelper>(ConfiguredBreakHelper);
  });

  describe('', () => {
    beforeAll(() => {
      configuredBreak = factory<ConfiguredBreak>(ConfiguredBreakFactory).make();
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

    describe('', () => {
      beforeAll(() => {
        service = configuredBreak.service;

        service.configuredBreaks = [configuredBreak];
      });
      it('Should be able to determine if input fall on break time', () => {
        expect(
          helper.forService(service).whereBetweenHours(750, 760).exists(),
        ).toBeTruthy();
      });

      it('Can get first break that clashes with input time', () => {
        expect(
          helper.forService(service).whereBetweenHours(750, 760).first(),
        ).toBe(configuredBreak);
      });

      it('Can get sum of breaks hours between input', () => {
        expect(
          helper
            .forService(service)
            .whereBetweenHours(750, 760)
            .sumOfHoursInMinutes(),
        ).toBe(60);
      });
    });
  });
});
