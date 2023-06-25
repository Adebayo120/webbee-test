import { ServiceHelper } from './../helpers/service.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Service } from './../service/service.entity';
import { SlotHelper } from './slot.helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './../appointment/appointment.entity';
import { Repository } from 'typeorm';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { PlannedOffHelper } from './planned-off.helper';
import { BookableCalenderHelper } from './bookable-calender.helper';
import factory from './../factories/factory.helper';
import { ServiceFactory } from './../factories/entities/service.factory';
import { AppointmentFactory } from './../factories/entities/appointment.factory';
import * as moment from 'moment';
import { faker } from '@faker-js/faker';
import { BookableCalender } from './../bookable-calender/bookable-calender.entity';
import { BookableCalenderFactory } from './../factories/entities/bookable-calender.factory';
import { AvailableSlot } from './../slot/object-types/available-slot.type';

const appointment = factory<Appointment>(AppointmentFactory).make();
const bookableCalender = factory<BookableCalender>(
  BookableCalenderFactory,
).make();

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findBy: jest.fn().mockResolvedValue([appointment]),
  find: jest.fn().mockResolvedValue([appointment]),
});

type MockServiceHelper = Partial<Record<keyof ServiceHelper, jest.Mock>>;
const createServiceHelper = (): MockServiceHelper => ({
  forService: jest.fn().mockReturnThis(),
  bookableCalenderForSlotDate: jest.fn().mockReturnValue(bookableCalender),
  hasFutureBookableDayLimit: jest.fn().mockReturnValue(true),
  futureBookableDateIsSameOrAfter: jest.fn().mockReturnValue(true),
});

type MockConfiguredBreakHelper = Partial<
  Record<keyof ConfiguredBreakHelper, jest.Mock>
>;
const createConfiguredBreakHelper = (): MockConfiguredBreakHelper => ({
  forService: jest.fn().mockReturnThis(),
  whereBetweenHours: jest.fn().mockReturnThis(),
  sumOfHoursInMinutes: jest.fn().mockReturnValue(10),
  exists: jest.fn().mockReturnValue(true),
});

type MockPlannedOffHelper = Partial<Record<keyof PlannedOffHelper, jest.Mock>>;
const createPlannedOffHelper = (): MockPlannedOffHelper => ({
  forService: jest.fn().mockReturnThis(),
  whereBetween: jest.fn().mockReturnThis(),
  exists: jest.fn().mockReturnValue(true),
});

type MockBookableCalenderHelper = Partial<
  Record<keyof BookableCalenderHelper, jest.Mock>
>;
const createBookableCalenderHelper = (): MockBookableCalenderHelper => ({
  forBookableCalender: jest.fn().mockReturnThis(),
  isAvailable: jest.fn().mockReturnValue(true),
  openingHourIsLessThanOrEqual: jest.fn((n: number): boolean => 480 <= n),
  closingHourIsGreaterThanOrEqual: jest.fn((n: number): boolean => 600 >= n),
  generateCalenderSlotHoursInMinutes: jest.fn().mockReturnThis(),
  getBookableSlotsHoursInMinutes: jest.fn().mockReturnValue([
    [480, 510],
    [520, 550],
    [560, 590],
  ]),
});

describe('PlannedOff Helper', () => {
  let helper: SlotHelper;
  let service: Service;
  let plannedOffHelper: MockPlannedOffHelper;

  beforeEach(async () => {
    service = factory<Service>(ServiceFactory).make();

    plannedOffHelper = createPlannedOffHelper();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotHelper,
        {
          provide: getRepositoryToken(Appointment),
          useValue: createMockRepository(),
        },
        {
          provide: ServiceHelper,
          useValue: createServiceHelper(),
        },
        {
          provide: ConfiguredBreakHelper,
          useValue: createConfiguredBreakHelper(),
        },
        {
          provide: PlannedOffHelper,
          useValue: plannedOffHelper,
        },
        {
          provide: BookableCalenderHelper,
          useValue: createBookableCalenderHelper(),
        },
      ],
    }).compile();

    helper = module.get<SlotHelper>(SlotHelper);
  });

  it('can return the service it belongs to', () => {
    expect(helper.forService(service).getService()).toBe(service);
  });

  it('can query booked appointments between dates', async () => {
    const appointments = await helper
      .forService(service)
      .queryBookedAppointmentsForDates(
        moment(),
        moment().add(faker.number.int(), 'days'),
      );

    expect(appointments).toHaveLength(1);

    expect(appointments[0]).toBe(appointment);
  });

  it('can get start date', () => {
    const startDate = moment();

    expect(helper.forService(service).forSlot(startDate).getStartDate()).toBe(
      startDate,
    );
  });

  it('can get end date', () => {
    const startDate = moment();

    expect(
      helper.forService(service).forSlot(startDate).getEndDate().format(),
    ).toBe(
      startDate.clone().add(service.bookableDurationInMinutes, 'm').format(),
    );
  });

  it('can get bookable appointment count', () => {
    const bookedAppointmentCount = faker.number.int();
    expect(
      helper
        .forService(service)
        .bookableAppointmentCount(bookedAppointmentCount),
    ).toBe(service.bookableAppointmentsPerSlotCount - bookedAppointmentCount);
  });

  it('can check if slot fall on planned date', () => {
    expect(
      helper.fallOnPlannedOffDate(
        moment(),
        moment().add(faker.number.int(), 'day'),
      ),
    ).toBeTruthy();
  });

  it('can get booked appointments between date', async () => {
    const slotHelper = await helper.setBookedAppointmentsBetweenDates(
      moment(appointment.startDate),
      moment(appointment.endDate),
    );

    const bookedAppointments = slotHelper.bookedAppointmentsForDate(
      moment(appointment.startDate),
      moment(appointment.endDate),
    );

    expect(bookedAppointments).toHaveLength(1);
    expect(bookedAppointments[0]).toBe(appointment);
  });

  it('can get the number of booked appointments between date', async () => {
    const slotHelper = await helper.setBookedAppointmentsBetweenDates(
      moment(appointment.startDate),
      moment(appointment.endDate),
    );

    expect(
      slotHelper.bookedAppointmentsCountForDate(
        moment(appointment.startDate),
        moment(appointment.endDate),
      ),
    ).toBe(1);
  });

  it('can get if date fall between future bookable date', () => {
    expect(helper.fallBetweenFutureBookableDate(moment())).toBeTruthy();
  });

  it('can get days between start and end date', () => {
    expect(
      helper
        .whereBetween(moment('2023-06-19'), moment('2023-06-23'))
        .daysBetweenStartAndEndDate(),
    ).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
  });

  it('can get end hour in minutes', () => {
    expect(helper.forService(service).getEndHourInMinutes(20)).toEqual(50);
  });

  it('can add configured break hours in minutes', () => {
    expect(helper.forService(service).addBreaksHoursInMinutes(20)).toEqual(30);
  });

  it('can add break beatween slots hours in minutes', () => {
    service.breakBetweenSlotsInMinutes = 20;

    expect(helper.forService(service).addBreakBetweenSlot(20)).toEqual(40);
  });

  it('can check if start date is after now', () => {
    expect(
      helper
        .whereBetween(moment().add(1, 'd'), moment().add(2, 'd'))
        .startDateIsAfterNow(),
    ).toBeTruthy();
  });

  it('can check if slot is not booked out', async () => {
    expect(
      await helper
        .whereBetween(moment(), moment().add(2, 'd'))
        .forService(service)
        .isNotBookedOut(1),
    ).toBeTruthy();
  });

  it('can check if slot is booked out', async () => {
    expect(
      await helper
        .whereBetween(moment(), moment().add(2, 'd'))
        .forService(service)
        .isNotBookedOut(3),
    ).toBeFalsy();
  });

  it('can check if slot belongs to available calender', async () => {
    expect(await helper.belongsToAnAvailableBookableDay()).toBeTruthy();
  });

  it('can check if slot time is bookable', () => {
    expect(
      helper
        .forService(service)
        .forSlot(moment().startOf('day').add(480, 'm'))
        .timeIsBookable(),
    ).toBeTruthy();
  });

  it('can check if slot fall on configured break', () => {
    expect(helper.forService(service).fallOnConfiguredBreaks()).toBeTruthy();
  });

  it('can check if slot fall is among available slots in day', () => {
    expect(
      helper
        .forService(service)
        .forSlot(moment().startOf('day').add(480, 'm'))
        .isAmongAvailableSlotsInDay(),
    ).toBeTruthy();
  });

  describe('', () => {
    let availableSlots: AvailableSlot[];
    let availableDates: string[];
    let availableSlotHourInMinutes: number;
    beforeAll(async () => {
      bookableCalender.day = moment().day();
      service.bookableCalenders = [bookableCalender];
      plannedOffHelper.exists
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      availableSlotHourInMinutes = 560;

      const slotHelper = await helper
        .whereBetween(moment(), moment().add(1, 'd'))
        .forService(service)
        .forAvailableBookableCalenders()
        .setBookedAppointmentsBetweenDates()
        .then((slotHelper: SlotHelper) => slotHelper.generateAvailableSlots());

      availableSlots = slotHelper.getAvailableSlots();
      availableDates = slotHelper.getAvailableDates();
    });

    it('can get available dates', async () => {
      if (
        moment().isAfter(
          moment().startOf('day').add(availableSlotHourInMinutes, 'm'),
        )
      ) {
        expect(availableDates).toHaveLength(0);
        expect(availableDates).toBe([]);
      } else {
        expect(availableDates).toHaveLength(1);
        expect(availableDates[0]).toBe(moment().format('dddd, MMMM Do YYYY'));
      }
    });

    it('can get available slots', async () => {
      if (
        moment().isAfter(
          moment().startOf('day').add(availableSlotHourInMinutes, 'm'),
        )
      ) {
        expect(availableSlots).toHaveLength(0);
        expect(availableSlots).toBe([]);
      } else {
        expect(availableSlots).toHaveLength(1);
        expect(availableSlots[0]).toMatchObject({
          startDate: moment()
            .startOf('day')
            .add(availableSlotHourInMinutes, 'm')
            .format('dddd, MMMM Do YYYY, h:mm:ss a'),
          bookableAppointmentsCount: service.bookableAppointmentsPerSlotCount,
        });
      }
    });
  });
});
