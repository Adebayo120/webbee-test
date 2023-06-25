import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { AppointmentFactory } from './../factories/entities/appointment.factory';
import factory from './../factories/factory.helper';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import { SlotValidatorsPipe } from '../validators/pipes/slot-validators/slot-validators.pipe';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './../service/service.entity';
import { SlotHelper } from './../helpers/slot.helper';
import { ProfileInput } from './dtos/profile.input';
import { ProfileInputFactory } from './../factories/entities/profile-input.factory';

const appointment = factory<Appointment>(AppointmentFactory).make();

type MockAppointmentService = Partial<
  Record<keyof AppointmentService, jest.Mock>
>;
const createAppointmentService = (): MockAppointmentService => ({
  bookAppointment: jest.fn().mockResolvedValue([appointment]),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({});

type MockSlotHelper = Partial<Record<keyof SlotHelper, jest.Mock>>;
const createSlotHelper = (): MockSlotHelper => ({});

describe('AppointmentResolver', () => {
  let resolver: AppointmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentResolver,
        {
          provide: AppointmentService,
          useValue: createAppointmentService(),
        },
        {
          provide: SlotValidatorsPipe,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Service),
          useValue: createMockRepository(),
        },
        {
          provide: SlotHelper,
          useValue: createSlotHelper(),
        },
      ],
    }).compile();

    resolver = module.get<AppointmentResolver>(AppointmentResolver);
  });

  it('should be able to book appointment', async () => {
    const bookedAppointments = await resolver.bookAppointment({
      serviceId: faker.number.int(),
      profiles: [factory<ProfileInput>(ProfileInputFactory).make()],
      startDate: moment().format(),
    });

    expect(bookedAppointments).toHaveLength(1);
    expect(bookedAppointments[0]).toMatchObject(appointment);
  });
});
