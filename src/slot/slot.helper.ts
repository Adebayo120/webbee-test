import * as moment from 'moment';
import { Appointment } from 'src/appointment/appointment.entity';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { BookableCalenderHelper } from 'src/bookable-calender/bookable-calender.helper';
import { ConfiguredBreakHelper } from 'src/configured-break/configured-break.helper';
import { PlannedOffHelper } from 'src/planned-off/planned-off-helper';
import { Service } from 'src/service/service.entity';
import { ServiceHelper } from 'src/service/service.helper';
import { Between, Repository } from 'typeorm';
import { AvailableSlotType } from './object-types/available-slot.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { start } from 'repl';

@Injectable()
export class SlotHelper {
  private startDate = moment().startOf('d');

  private endDate: moment.Moment;

  private service: Service;

  private serviceHelper: ServiceHelper;

  private configuredBreak: ConfiguredBreakHelper;

  private bookableCalender: BookableCalenderHelper;

  private availableBookableCalenders: BookableCalender[];

  private appointmentRepository: Repository<Appointment>;

  private bookedAppointments: Appointment[];

  private startDateInMinutes: number;

  private endDateInMinutes: number;

  private day: number;

  private availableDates: string[] = [];

  private availableSlots: AvailableSlotType[] = [];

  whereBetween(startDate: moment.Moment, endDate: moment.Moment): this {
    this.startDate = startDate;

    this.endDate = endDate;

    return this;
  }

  forSlot(startDate: moment.Moment): this {
    this.startDate = startDate;

    const bookableCalender =
      this.serviceHelper.bookableCalenderForSlotDate(startDate);

    if (bookableCalender) {
      this.bookableCalender = new BookableCalenderHelper().forBookableCalender(
        bookableCalender,
      );
    }

    this.configuredBreak = new ConfiguredBreakHelper().forService(this.service);

    this.day = startDate.day();

    this.startDateInMinutes = startDate.hours() * 60 + startDate.minutes();

    this.endDateInMinutes = this.getEndHourInMinutes();

    return this;
  }

  forService(service: Service): this {
    this.service = service;

    this.serviceHelper = new ServiceHelper().forService(service);

    this.configuredBreak = new ConfiguredBreakHelper().forService(service);

    if (this.endDate === undefined) {
      this.endDate = this.serviceHelper.futureBookableDate();
    }

    return this;
  }

  forAvailableBookableCalenders(): this {
    const daysBetweenStartAndEndDate = this.daysBetweenStartAndEndDate();

    this.availableBookableCalenders = this.service.bookableCalenders.filter(
      (calender) =>
        calender.available && daysBetweenStartAndEndDate.includes(calender.day),
    );

    return this;
  }

  async queryBookedAppointmentsForDates(
    startDate?: moment.Moment,
    endDate?: moment.Moment,
  ): Promise<Appointment[]> {
    startDate = startDate ? startDate : this.startDate;
    endDate = endDate ? endDate : this.getEndDate();

    return this.appointmentRepository.findBy({
      start_date: startDate.format(),
      end_date: endDate.format(),
    });
  }

  async setBookedAppointmentsBetweenDates(
    appointmentRepository: Repository<Appointment>,
    startDate?: moment.Moment,
    endDate?: moment.Moment,
  ): Promise<this> {
    startDate = startDate ? startDate : this.startDate;

    endDate = endDate ? endDate : this.endDate;

    this.bookedAppointments = await appointmentRepository.find({
      where: {
        end_date: Between(startDate.format(), endDate.format()),
      },
    });

    return this;
  }

  getEndDate(): moment.Moment {
    return this.startDate
      .clone()
      .add(this.service.bookable_duration_in_minutes, 'm');
  }

  generateAvailableSlots(): this {
    this.availableBookableCalenders.forEach((calender: BookableCalender) => {
      const bookableCalenderHelper = new BookableCalenderHelper()
        .forService(this.service)
        .forBookableCalender(calender);

      const bookableSlotsHoursInMinutes = bookableCalenderHelper
        .generateCalenderSlotHoursInMinutes()
        .getBookableSlotsHoursInMinutes();

      if (!bookableSlotsHoursInMinutes.length) {
        return;
      }

      const startDate = this.startDate.isSameOrAfter(moment())
        ? this.startDate
        : moment();

      const bookableDate = startDate
        .clone()
        .startOf('week')
        .add(calender.day, 'day')
        .endOf('day');

      while (
        this.fallBetweenFutureBookableDate(bookableDate) &&
        bookableDate.isSameOrBefore(this.endDate)
      ) {
        let availableSlots: AvailableSlotType[] = [];

        bookableSlotsHoursInMinutes.forEach((arrayOfMinutes) => {
          const slotStartDate = bookableDate
            .clone()
            .startOf('day')
            .add(arrayOfMinutes[0], 'm');

          const slotEndDate = bookableDate
            .clone()
            .startOf('day')
            .add(arrayOfMinutes[1], 'm');

          const bookedAppointmentsCount = this.bookedAppointmentsCountForDate(
            slotStartDate,
            slotEndDate,
          );

          if (
            slotStartDate.isBefore(moment()) ||
            bookedAppointmentsCount >=
              this.service.bookable_appointments_per_slot_count ||
            this.fallOnPlannedOffDate(slotStartDate, slotEndDate)
          ) {
            return;
          }

          availableSlots.push({
            startDate: slotStartDate.format('dddd, MMMM Do YYYY, h:mm:ss a'),
            bookableAppointmentsCount: this.bookableAppointmentCount(
              bookedAppointmentsCount,
            ),
          });
        });

        this.availableSlots = [...this.availableSlots, ...availableSlots];

        if (availableSlots.length) {
          this.availableDates.push(bookableDate.format('dddd, MMMM Do YYYY'));
        }

        bookableDate.add(1, 'w').endOf('day');
      }
    });

    return this;
  }

  bookableAppointmentCount(bookedAppointmentsCount: number): number {
    return (
      this.service.bookable_appointments_per_slot_count -
      bookedAppointmentsCount
    );
  }

  fallOnPlannedOffDate(
    startDate?: moment.Moment,
    endDate?: moment.Moment,
  ): boolean {
    startDate = startDate ? startDate : this.startDate;

    endDate = endDate ? endDate : this.getEndDate();

    return new PlannedOffHelper()
      .forService(this.service)
      .whereBetween(startDate, endDate)
      .exists();
  }

  bookedAppointmentsForDate(
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): Appointment[] {
    return this.bookedAppointments.filter((bookedAppointment: Appointment) => {
      startDate.isSame(bookedAppointment.start_date) &&
        endDate.isSame(bookedAppointment.end_date);
    });
  }

  bookedAppointmentsCountForDate(
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): number {
    return this.bookedAppointmentsForDate(startDate, endDate).length;
  }

  fallBetweenFutureBookableDate(startDate?: moment.Moment): boolean {
    startDate = startDate ? startDate : this.startDate;

    return this.serviceHelper.hasFutureBookableDayLimit()
      ? this.serviceHelper.futureBookableDateIsSameOrAfter(startDate)
      : true;
  }

  daysBetweenStartAndEndDate(): number[] {
    const diff = this.endDate.diff(this.startDate, 'days');

    if (diff >= 6) {
      return [0, 1, 2, 3, 4, 5, 6];
    }

    const startDateDayOfWeek = this.startDate.day();

    let days = [];
    let checkCount = 0;
    while (checkCount <= diff) {
      const index = checkCount + startDateDayOfWeek;

      days.push(index > 6 ? index - 7 : index);

      checkCount++;
    }

    return days;
  }

  getEndHourInMinutes(startHourInMinutes?: number): number {
    startHourInMinutes = startHourInMinutes
      ? startHourInMinutes
      : this.startDateInMinutes;

    return startHourInMinutes + this.service.bookable_duration_in_minutes;
  }

  addBreaksHoursInMinutes(hourInMinutes?: number): number {
    hourInMinutes = hourInMinutes ? hourInMinutes : this.endDateInMinutes;

    const hourPlusBreakBetweenSlot = this.addBreakBetweenSlot(hourInMinutes);

    const sumOfConfiguredBreakHoursInMinutes = this.configuredBreak
      .whereBetweenHours(hourInMinutes, hourPlusBreakBetweenSlot)
      .sumOfHoursInMinutes();

    return sumOfConfiguredBreakHoursInMinutes >
      this.service.break_between_slots_in_minutes
      ? hourInMinutes + sumOfConfiguredBreakHoursInMinutes
      : hourPlusBreakBetweenSlot;
  }

  addBreakBetweenSlot(hourInMinutes?: number) {
    hourInMinutes = hourInMinutes ? hourInMinutes : this.endDateInMinutes;

    return hourInMinutes + this.service.break_between_slots_in_minutes;
  }

  getAvailableDates(): string[] {
    return this.availableDates;
  }

  getAvailableSlots(): AvailableSlotType[] {
    return this.availableSlots;
  }

  startDateIsAfterNow(): boolean {
    return this.startDate.isAfter(moment());
  }

  async isAvailable(additionalAppointmentsCount: number = 0): Promise<boolean> {
    const bookedAppointments = await this.queryBookedAppointmentsForDates();

    return;
    this.bookableCalender.isAvailable() &&
      this.bookableAppointmentCount(bookedAppointments.length) >=
        additionalAppointmentsCount;
  }

  setAppointmentRepository(
    appointmentRepository: Repository<Appointment>,
  ): this {
    this.appointmentRepository = appointmentRepository;

    return this;
  }

  existsInBookableCalender(): boolean {
    return (
      this.bookableCalender.dayIsEqual(this.day) &&
      this.bookableCalender.openingHourIsLessThanOrEqual(
        this.startDateInMinutes,
      ) &&
      this.bookableCalender.closingHourIsGreaterThanOrEqual(
        this.endDateInMinutes,
      )
    );
  }

  fallBetweenConfiguredBreaks(): boolean {
    return this.configuredBreak
      .whereBetweenHours(this.startDateInMinutes, this.getEndHourInMinutes())
      .exists();
  }

  existsInBookableSlots(): boolean {
    const calenderBookableSlotHoursInMinutes = this.bookableCalender
      .generateCalenderSlotHoursInMinutes()
      .getBookableSlotsHoursInMinutes();

    return (
      this.bookableCalender.dayIsEqual(this.day) &&
      calenderBookableSlotHoursInMinutes.includes([
        this.startDateInMinutes,
        this.endDateInMinutes,
      ])
    );
  }
}
