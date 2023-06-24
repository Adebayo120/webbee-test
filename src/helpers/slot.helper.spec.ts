import { ServiceHelper } from './../helpers/service.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Service } from './../service/service.entity';
import * as moment from 'moment';
import { SlotHelper } from './slot.helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './../appointment/appointment.entity';
import { Repository } from 'typeorm';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { PlannedOffHelper } from './planned-off.helper';
import { BookableCalenderHelper } from './bookable-calender.helper';
import factory from './../factories/factory.helper';
import { ServiceFactory } from './../factories/entities/service.factory';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findBy: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
});

type MockServiceHelper = Partial<Record<keyof ServiceHelper, jest.Mock>>;
const createServiceHelper = (): MockServiceHelper => ({
  forService: jest.fn().mockReturnThis(),
});

type MockConfiguredBreakHelper = Partial<
  Record<keyof ConfiguredBreakHelper, jest.Mock>
>;
const createConfiguredBreakHelper = (): MockConfiguredBreakHelper => ({
  forService: jest.fn().mockReturnThis(),
});

type MockPlannedOffHelper = Partial<Record<keyof PlannedOffHelper, jest.Mock>>;
const createPlannedOffHelper = (): MockPlannedOffHelper => ({
  forService: jest.fn().mockReturnThis(),
});

type MockBookableCalenderHelper = Partial<
  Record<keyof BookableCalenderHelper, jest.Mock>
>;
const createBookableCalenderHelper = (): MockBookableCalenderHelper => ({});

describe('PlannedOff Helper', () => {
  let helper: SlotHelper;
  let service: Service;

  beforeEach(async () => {
    service = factory<Service>(ServiceFactory).make();

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
          useValue: createPlannedOffHelper(),
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

  it('can query booked appointments between dates', () => {
    expect(helper.forService(service).getService()).toBe(service);
  });
});
