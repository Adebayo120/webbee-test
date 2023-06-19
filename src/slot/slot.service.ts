import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Injectable } from '@nestjs/common';
import { Slot } from './slot.entity';

@Injectable()
export class SlotService {
  async availableSlots(
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<Slot[]> {
    const slot = new Slot();
    slot.id = 1;
    slot.name = 'Adam';

    return [slot];
  }
}
