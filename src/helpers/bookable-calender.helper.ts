import { BookableCalender } from '../modules/bookable-calender/bookable-calender.entity';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { SlotHelper } from './slot.helper';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
export class BookableCalenderHelper {
  constructor(
    @Inject(forwardRef(() => SlotHelper)) private slotHelper: SlotHelper,
    private configuredBreak: ConfiguredBreakHelper,
  ) {}

  private bookableCalender: BookableCalender;

  private bookableSlotsHoursInMinutes: [number, number][];

  forBookableCalender(bookableCalender: BookableCalender): this {
    this.bookableCalender = bookableCalender;

    return this;
  }

  generateCalenderSlotHoursInMinutes(): this {
    this.bookableSlotsHoursInMinutes = [];

    this.generateSlotHoursInMinutes(this.bookableCalender.openingHourInMinutes);
    return this;
  }

  exists(): boolean {
    return !!this.bookableCalender;
  }

  private generateSlotHoursInMinutes(slotStartHourInMinutes: number): void {
    const slotEndHourInMinutes = this.slotHelper.getEndHourInMinutes(
      slotStartHourInMinutes,
    );

    const configuredBreak = this.configuredBreak
      .whereBetweenHours(slotStartHourInMinutes, slotEndHourInMinutes)
      .first();

    if (configuredBreak) {
      this.generateSlotHoursInMinutes(configuredBreak.endHourInMinutes);
      return;
    }

    if (this.closingHourIsLessThan(slotEndHourInMinutes)) {
      return;
    }

    this.bookableSlotsHoursInMinutes.push([
      slotStartHourInMinutes,
      slotEndHourInMinutes,
    ]);

    this.generateSlotHoursInMinutes(
      this.slotHelper.addBreaksHoursInMinutes(slotEndHourInMinutes),
    );
  }

  closingHourIsLessThan(hourInMinutes: number): boolean {
    return this.bookableCalender.closingHourInMinutes < hourInMinutes;
  }

  getBookableSlotsHoursInMinutes(): [number, number][] {
    return this.bookableSlotsHoursInMinutes;
  }

  isAvailable(): boolean {
    return this.bookableCalender.available;
  }

  dayIsEqual(day: number): boolean {
    return this.bookableCalender.day === day;
  }

  openingHourIsLessThanOrEqual(hourInMinutes: number): boolean {
    return this.bookableCalender.openingHourInMinutes <= hourInMinutes;
  }

  closingHourIsGreaterThanOrEqual(hourInMinutes: number): boolean {
    return this.bookableCalender.closingHourInMinutes >= hourInMinutes;
  }
}
