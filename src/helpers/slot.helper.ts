import * as moment from 'moment';
import { Appointment } from 'src/appointment/appointment.entity';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { BookableCalenderHelper } from 'src/helpers/bookable-calender.helper';
import { ConfiguredBreakHelper } from 'src/helpers/configured-break.helper';
import { PlannedOffHelper } from 'src/helpers/planned-off.helper';
import { Service } from 'src/service/service.entity';
import { ServiceHelper } from 'src/helpers/service.helper';
import { Between, Repository } from 'typeorm';
import { AvailableSlot } from '../slot/object-types/available-slot.type';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SlotHelper {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private serviceHelper: ServiceHelper,
    private configuredBreak: ConfiguredBreakHelper,
    @Inject(forwardRef(() => BookableCalenderHelper))
    private bookableCalenderHelper: BookableCalenderHelper,
    private plannedOffHelper: PlannedOffHelper,
  ) {}

  private startDate = moment().startOf('d');

  private endDate: moment.Moment;

  private service: Service;

  private availableBookableCalenders: BookableCalender[];

  private bookedAppointments: Appointment[];

  private startDateInMinutes: number;

  private endDateInMinutes: number;

  private day: number;

  private availableDates: string[] = [];

  private availableSlots: AvailableSlot[] = [];

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
      this.bookableCalenderHelper =
        this.bookableCalenderHelper.forBookableCalender(bookableCalender);
    }

    this.day = startDate.day();

    this.startDateInMinutes = startDate.hours() * 60 + startDate.minutes();

    this.endDateInMinutes = this.getEndHourInMinutes();

    return this;
  }

  forService(service: Service): this {
    this.service = service;

    this.serviceHelper = this.serviceHelper.forService(service);

    this.configuredBreak = this.configuredBreak.forService(service);

    this.plannedOffHelper = this.plannedOffHelper.forService(service);

    if (this.endDate) {
      this.endDate = this.serviceHelper.futureBookableDate();
    }

    return this;
  }

  getService(): Service {
    return this.service;
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
      startDate: startDate.format(),
      endDate: endDate.format(),
    });
  }

  async setBookedAppointmentsBetweenDates(
    startDate?: moment.Moment,
    endDate?: moment.Moment,
  ): Promise<this> {
    startDate = startDate ? startDate : this.startDate;

    endDate = endDate ? endDate : this.endDate;

    this.bookedAppointments = await this.appointmentRepository.find({
      where: {
        endDate: Between(startDate.format(), endDate.format()),
      },
    });

    return this;
  }

  getStartDate(): moment.Moment {
    return this.startDate;
  }

  getEndDate(): moment.Moment {
    return this.startDate
      .clone()
      .add(this.service.bookableDurationInMinutes, 'm');
  }

  generateAvailableSlots(): this {
    this.availableBookableCalenders.forEach((calender: BookableCalender) => {
      const bookableCalenderHelper =
        this.bookableCalenderHelper.forBookableCalender(calender);

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
        const availableSlots: AvailableSlot[] = [];

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
              this.service.bookableAppointmentsPerSlotCount ||
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
      this.service.bookableAppointmentsPerSlotCount - bookedAppointmentsCount
    );
  }

  fallOnPlannedOffDate(
    startDate?: moment.Moment,
    endDate?: moment.Moment,
  ): boolean {
    startDate = startDate ? startDate : this.startDate;

    endDate = endDate ? endDate : this.getEndDate();

    return this.plannedOffHelper.whereBetween(startDate, endDate).exists();
  }

  bookedAppointmentsForDate(
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): Appointment[] {
    return this.bookedAppointments.filter((bookedAppointment: Appointment) => {
      return (
        startDate.isSame(bookedAppointment.startDate) &&
        endDate.isSame(bookedAppointment.endDate)
      );
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

    const days: number[] = [];
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

    return startHourInMinutes + this.service.bookableDurationInMinutes;
  }

  addBreaksHoursInMinutes(hourInMinutes?: number): number {
    hourInMinutes = hourInMinutes ? hourInMinutes : this.endDateInMinutes;

    const hourPlusBreakBetweenSlot = this.addBreakBetweenSlot(hourInMinutes);

    const sumOfConfiguredBreakHoursInMinutes = this.configuredBreak
      .whereBetweenHours(hourInMinutes, hourPlusBreakBetweenSlot)
      .sumOfHoursInMinutes();

    return sumOfConfiguredBreakHoursInMinutes >
      this.service.breakBetweenSlotsInMinutes
      ? hourInMinutes + sumOfConfiguredBreakHoursInMinutes
      : hourPlusBreakBetweenSlot;
  }

  addBreakBetweenSlot(hourInMinutes?: number) {
    hourInMinutes = hourInMinutes ? hourInMinutes : this.endDateInMinutes;

    return hourInMinutes + this.service.breakBetweenSlotsInMinutes;
  }

  getAvailableDates(): string[] {
    return this.availableDates;
  }

  getAvailableSlots(): AvailableSlot[] {
    return this.availableSlots;
  }

  startDateIsAfterNow(): boolean {
    return this.startDate.isAfter(moment());
  }

  async isNotBookedOut(additionalAppointmentsCount = 0): Promise<boolean> {
    const bookedAppointments = await this.queryBookedAppointmentsForDates();

    return (
      this.bookableAppointmentCount(bookedAppointments.length) >=
      additionalAppointmentsCount
    );
  }

  setAppointmentRepository(
    appointmentRepository: Repository<Appointment>,
  ): this {
    this.appointmentRepository = appointmentRepository;

    return this;
  }

  belongsToAnAvailableBookableDay(): boolean {
    return this.bookableCalenderHelper.isAvailable();
  }

  timeIsBookable(): boolean {
    return (
      this.bookableCalenderHelper.openingHourIsLessThanOrEqual(
        this.startDateInMinutes,
      ) &&
      this.bookableCalenderHelper.closingHourIsGreaterThanOrEqual(
        this.endDateInMinutes,
      )
    );
  }

  fallOnConfiguredBreaks(): boolean {
    return this.configuredBreak
      .whereBetweenHours(this.startDateInMinutes, this.getEndHourInMinutes())
      .exists();
  }

  isAmongAvailableSlotsInDay(): boolean {
    const calenderBookableSlotHoursInMinutes = this.bookableCalenderHelper
      .generateCalenderSlotHoursInMinutes()
      .getBookableSlotsHoursInMinutes()
      .map((arrayOfMinutes) => arrayOfMinutes.join(' '));

    return calenderBookableSlotHoursInMinutes.includes(
      `${this.startDateInMinutes} ${this.endDateInMinutes}`,
    );
  }
}
