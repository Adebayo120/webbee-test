import { Test, TestingModule } from '@nestjs/testing';
import { SlotResolver } from './slot.resolver';
import { SlotService } from './slot.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './../service/service.entity';
import { Slot } from './object-types/slot.type';
import { SlotFactory } from './../factories/entities/slot.factory';
import factory from './../factories/factory.helper';
import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { GetAvailableSlotsInputFactory } from './../factories/entities/get-available-slots-input.factory';

const slot: Slot = factory<Slot>(SlotFactory).make();

type MockSlotService = Partial<Record<keyof SlotService, jest.Mock>>;
const createSlotService = (): MockSlotService => ({
  availableSlots: jest.fn().mockResolvedValue(slot),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({});

describe('SlotResolver', () => {
  let resolver: SlotResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotResolver,
        {
          provide: SlotService,
          useValue: createSlotService(),
        },
        {
          provide: getRepositoryToken(Service),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    resolver = module.get<SlotResolver>(SlotResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should be able to list available slots', async () => {
    expect(
      await resolver.availableSlots(
        factory<GetAvailableSlotsInput>(GetAvailableSlotsInputFactory).make(),
      ),
    ).toBe(slot);
  });
});
