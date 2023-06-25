import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import factory from './../factories/factory.helper';
import { ProfileInput } from './dtos/profile.input';
import { ProfileInputFactory } from './../factories/entities/profile-input.factory';
import { Repository } from 'typeorm';
import { SlotHelper } from './../helpers/slot.helper';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({});

type MockSlotHelper = Partial<Record<keyof SlotHelper, jest.Mock>>;
const createSlotHelper = (): MockSlotHelper => ({});

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to book appointment', async() => {
    expect(
      await service.bookAppointment([
        factory<ProfileInput>(ProfileInputFactory).make(),
      ]),
    ).toBe();
  });
});
