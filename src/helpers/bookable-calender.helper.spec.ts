import { Service } from './../service/service.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BookableCalenderHelper } from './bookable-calender.helper';
import { BookableCalender } from './../bookable-calender/bookable-calender.entity';
import { DaysOfTheWeekEnum } from './../bookable-calender/enums/days-of-the-week.enums';
import { SlotHelper } from './slot.helper';
import { ConfiguredBreakHelper } from './configured-break.helper';

const createService = (): Service => ({
  id: 1,
  name: 'Men Haircut',
  businessAdministrator: {
    id: 1,
    name: 'Hair Saloon',
    services: [],
  },
  bookableDurationInMinutes: 30,
  breakBetweenSlotsInMinutes: 0,
  futureBookableDays: 7,
  bookableAppointmentsPerSlotCount: 3,
  bookableCalenders: [],
  configuredBreaks: [],
  appointments: [],
  plannedOffs: [],
});

const createCalender = (): BookableCalender => ({
  id: 1,
  day: DaysOfTheWeekEnum.MONDAY,
  openingHourInMinutes: 480,
  closingHourInMinutes: 600,
  available: true,
  service: createService(),
});

type MockSlotHelper = Partial<Record<keyof SlotHelper, jest.Mock>>;
const createSlotHelper = (): MockSlotHelper => ({
  getEndHourInMinutes: jest.fn(
    (n: number) => n + createService().bookableDurationInMinutes,
  ),
  addBreaksHoursInMinutes: jest.fn((n: number) => n),
});

type MockConfiguredBreakHelper = Partial<
  Record<keyof ConfiguredBreakHelper, jest.Mock>
>;
const createConfiguredBreakHelper = (): MockConfiguredBreakHelper => ({
  first: jest.fn().mockReturnValue(null),
  whereBetweenHours: jest.fn().mockReturnThis(),
});

describe('PlannedOff Helper', () => {
  let helper: BookableCalenderHelper;
  let slotHelper: MockSlotHelper;
  let service: Service;
  let calender: BookableCalender;

  beforeEach(async () => {
    slotHelper = createSlotHelper();
    service = createService();
    calender = createCalender();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookableCalenderHelper,
        {
          provide: SlotHelper,
          useValue: slotHelper,
        },
        {
          provide: ConfiguredBreakHelper,
          useValue: createConfiguredBreakHelper(),
        },
      ],
    }).compile();

    helper = module.get<BookableCalenderHelper>(BookableCalenderHelper);
  });

  it('can help check that input is equal to calender day', function () {
    expect(
      helper.forBookableCalender(calender).dayIsEqual(calender.day),
    ).toBeTruthy();
  });

  it('can help check that input is equal to calender day', function () {
    expect(
      helper.forBookableCalender(calender).dayIsEqual(calender.day),
    ).toBeTruthy();
  });

  it('can help check that input is not equal to calender day', function () {
    expect(
      helper.forBookableCalender(calender).dayIsEqual(calender.day + 1),
    ).toBeFalsy();
  });

  it('can help check that calender opening hour is less than or equal to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .openingHourIsLessThanOrEqual(calender.openingHourInMinutes),
    ).toBeTruthy();
  });

  it('can check that calender opening hour is not less than or equal to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .openingHourIsLessThanOrEqual(calender.openingHourInMinutes - 1),
    ).toBeFalsy();
  });

  it('can check that calender closing hour is greater than or equal to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .closingHourIsGreaterThanOrEqual(calender.closingHourInMinutes),
    ).toBeTruthy();
  });

  it('can check that calender closing hour is not greater than or equal to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .closingHourIsGreaterThanOrEqual(calender.closingHourInMinutes + 1),
    ).toBeFalsy();
  });

  it('can check that calender closing hour is less than to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .closingHourIsLessThan(calender.closingHourInMinutes + 1),
    ).toBeTruthy();
  });

  it('can check that calender closing hour is not less than to input', function () {
    expect(
      helper
        .forBookableCalender(calender)
        .closingHourIsLessThan(calender.closingHourInMinutes),
    ).toBeFalsy();
  });

  it('can check that calender is available', function () {
    expect(helper.forBookableCalender(calender).isAvailable()).toBeTruthy();
  });

  it('can generate correct calender hours in minutes', function () {
    const slots = helper
      .forBookableCalender(calender)
      .generateCalenderSlotHoursInMinutes()
      .getBookableSlotsHoursInMinutes();

    expect(slots).toHaveLength(4);

    expect(slots[0].join(' ')).toBe('480 510');
    expect(slots[1].join(' ')).toBe('510 540');
    expect(slots[2].join(' ')).toBe('540 570');
    expect(slots[3].join(' ')).toBe('570 600');
  });

  it('can generate correct calender hours in minutes with breaks between slot', function () {
    slotHelper.addBreaksHoursInMinutes.mockImplementation((n) => n + 10);

    const slots = helper
      .forBookableCalender(calender)
      .generateCalenderSlotHoursInMinutes()
      .getBookableSlotsHoursInMinutes();

    expect(slots).toHaveLength(3);

    expect(slots[0].join(' ')).toBe('480 510');
    expect(slots[1].join(' ')).toBe('520 550');
    expect(slots[2].join(' ')).toBe('560 590');
  });
});
