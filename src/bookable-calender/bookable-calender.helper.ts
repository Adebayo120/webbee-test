import { Service } from 'src/service/service.entity';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { ConfiguredBreakHelper } from 'src/configured-break/configured-break.helper';
import { SlotHelper } from 'src/slot/slot.helper';
export class BookableCalenderHelper {
  private bookableCalender: BookableCalender;

  private service: Service;

  private configuredBreak: ConfiguredBreakHelper;

  private slot: SlotHelper;

  private bookableSlotsHoursInMinutes: [number, number][];

  forService(service: Service): this {
    this.service = service;

    return this;
  }

  forBookableCalender(bookableCalender: BookableCalender): this {
    this.bookableCalender = bookableCalender;

    return this;
  }

  generateCalenderSlotHoursInMinutes(): this {
    this.configuredBreak = new ConfiguredBreakHelper().forService(this.service);

    this.slot = new SlotHelper().forService(this.service);

    this.bookableSlotsHoursInMinutes = [];

    this.generateSlotHoursInMinutes(
      this.bookableCalender.opening_hour_in_minutes,
    );
    return this;
  }

  private generateSlotHoursInMinutes(slotStartHourInMinutes: number): void {
    const slotEndHourInMinutes = this.slot.getEndHourInMinutes(
      slotStartHourInMinutes,
    );

    const configuredBreak = this.configuredBreak
      .whereBetweenHours(slotStartHourInMinutes, slotEndHourInMinutes)
      .first();

    if (configuredBreak) {
      this.generateSlotHoursInMinutes(configuredBreak.end_hour_in_minutes);
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
      this.slot.addBreaksHoursInMinutes(slotEndHourInMinutes),
    );
  }

  closingHourIsLessThan(hourInMinutes: number): boolean {
    return this.bookableCalender.closing_hour_in_minutes < hourInMinutes;
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
    return this.bookableCalender.opening_hour_in_minutes <= hourInMinutes;
  }

  closingHourIsGreaterThanOrEqual(hourInMinutes: number): boolean {
    return this.bookableCalender.closing_hour_in_minutes >= hourInMinutes;
  }
}
