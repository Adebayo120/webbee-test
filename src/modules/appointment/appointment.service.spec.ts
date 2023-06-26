import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import factory from '../../factories/factory.helper';
import { ProfileInput } from './dtos/profile.input';
import { ProfileInputFactory } from '../../factories/entities/profile-input.factory';
import { Repository } from 'typeorm';
import { SlotHelper } from '../../helpers/slot.helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Service } from '../service/service.entity';
import { ServiceFactory } from '../../factories/entities/service.factory';
import * as moment from 'moment';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  insert: jest.fn(),
});

type MockSlotHelper = Partial<Record<keyof SlotHelper, jest.Mock>>;
const createSlotHelper = (): MockSlotHelper => ({
  getService: jest
    .fn()
    .mockReturnValue(factory<Service>(ServiceFactory).make()),
  getStartDate: jest.fn().mockReturnValue(moment()),
  getEndDate: jest.fn().mockReturnValue(moment().add(1, 'd')),
});

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: SlotHelper,
          useValue: createSlotHelper(),
        },
        {
          provide: getRepositoryToken(Appointment),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to book appointment', async () => {
    const appointment = factory<ProfileInput>(ProfileInputFactory).make();

    const bookedAppointments = await service.bookAppointment([appointment]);

    expect(bookedAppointments).toHaveLength(1);

    expect(bookedAppointments[0]).toMatchObject(appointment);
  });
});
