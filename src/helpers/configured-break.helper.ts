import { Injectable, Scope } from '@nestjs/common';
import { ConfiguredBreak } from '../configured-break/configured-break.entity';
import { Service } from 'src/service/service.entity';

@Injectable({ scope: Scope.REQUEST })
export class ConfiguredBreakHelper {
  private break: ConfiguredBreak;

  private breaks: ConfiguredBreak[];

  private breaksBetweenHours: ConfiguredBreak[];

  forService(service: Service): this {
    this.breaks = service.configuredBreaks;

    return this;
  }

  forBreak(configuredBreak: ConfiguredBreak): this {
    this.break = configuredBreak;

    return this;
  }

  first(): ConfiguredBreak | null {
    return this.breaksBetweenHours.length ? this.breaksBetweenHours[0] : null;
  }

  exists(): boolean {
    return !!this.breaksBetweenHours.length;
  }

  whereBetweenHours(
    startHourInMinutes: number,
    endHourInMinutes: number,
  ): this {
    this.breaksBetweenHours = this.breaks.filter((configuredBreak) => {
      const configuredBreakHelper = this.forBreak(configuredBreak);

      return (
        configuredBreakHelper.startHourInMinutesIsEqual(startHourInMinutes) ||
        configuredBreakHelper.endHourInMinutesIsEqual(endHourInMinutes) ||
        (configuredBreakHelper.startHourInMinutesIsLessThan(
          startHourInMinutes,
        ) &&
          configuredBreakHelper.endHourInMinutesIsGreaterThan(
            startHourInMinutes,
          )) ||
        (configuredBreakHelper.startHourInMinutesIsLessThan(endHourInMinutes) &&
          configuredBreakHelper.endHourInMinutesIsGreaterThan(
            endHourInMinutes,
          )) ||
        (configuredBreakHelper.startHourInMinutesIsGreaterThan(
          startHourInMinutes,
        ) &&
          configuredBreakHelper.endHourInMinutesIsLessThan(endHourInMinutes))
      );
    });

    return this;
  }

  startHourInMinutesIsEqual(hourInMinutes: number): boolean {
    return this.break.start_hour_in_minutes === hourInMinutes;
  }

  startHourInMinutesIsLessThan(hourInMinutes: number): boolean {
    return this.break.start_hour_in_minutes < hourInMinutes;
  }

  startHourInMinutesIsGreaterThan(hourInMinutes: number): boolean {
    return this.break.start_hour_in_minutes > hourInMinutes;
  }

  endHourInMinutesIsEqual(hourInMinutes: number): boolean {
    return this.break.end_hour_in_minutes === hourInMinutes;
  }

  endHourInMinutesIsLessThan(hourInMinutes: number): boolean {
    return this.break.end_hour_in_minutes < hourInMinutes;
  }

  endHourInMinutesIsGreaterThan(hourInMinutes: number): boolean {
    return this.break.end_hour_in_minutes > hourInMinutes;
  }

  sumOfHoursInMinutes(): number {
    return this.breaksBetweenHours
      .map(
        (configureBreak) =>
          configureBreak.end_hour_in_minutes -
          configureBreak.start_hour_in_minutes,
      )
      .reduce((a, b) => a + b, 0);
  }
}
