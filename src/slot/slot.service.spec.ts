import { Test, TestingModule } from '@nestjs/testing';
import { SlotService } from './slot.service';
import { SlotHelper } from './../helpers/slot.helper';
import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import factory from './../factories/factory.helper';
import { GetAvailableSlotsInputFactory } from './../factories/entities/get-available-slots-input.factory';
import { Slot } from './object-types/slot.type';
import { SlotFactory } from './../factories/entities/slot.factory';
import { Service } from './../service/service.entity';
import { ServiceFactory } from './../factories/entities/service.factory';

const serviceEntity: Service = factory<Service>(ServiceFactory).make();

const slot: Slot = factory<Slot>(SlotFactory, {
  bookableDurationInMinutes: serviceEntity.bookableDurationInMinutes,
}).make();

type MockSlotHelper = Partial<Record<keyof SlotHelper, jest.Mock>>;
const createSlotHelper = (): MockSlotHelper => ({
  whereBetween: jest.fn().mockReturnThis(),
  forService: jest.fn().mockReturnThis(),
  forAvailableBookableCalenders: jest.fn().mockReturnThis(),
  setBookedAppointmentsBetweenDates: jest.fn(async function () {
    return this;
  }),
  generateAvailableSlots: jest.fn().mockReturnThis(),
  getAvailableDates: jest.fn().mockReturnValue(slot.availableDates),
  getAvailableSlots: jest.fn().mockReturnValue(slot.availableSlots),
});

describe('SlotService', () => {
  let service: SlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotService,
        {
          provide: SlotHelper,
          useValue: createSlotHelper(),
        },
      ],
    }).compile();

    service = module.get<SlotService>(SlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to list available slots', async () => {
    expect(
      await service.availableSlots(
        factory<GetAvailableSlotsInput>(GetAvailableSlotsInputFactory, {
          service: serviceEntity,
        }).make(),
      ),
    ).toMatchObject(slot);
  });
});
