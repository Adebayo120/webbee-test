import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Slot } from './object-types/slot.type';
import { GetAvailableSlotsPipe } from './pipes/get-available-slots.pipe';
import { SlotService } from './slot.service';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver((of) => Slot)
export class SlotResolver {
  constructor(private slotService: SlotService) {}

  @Query((returns) => Slot)
  availableSlots(
    @Args('getAvailableSlotsInput', GetAvailableSlotsPipe)
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<Slot> {
    return this.slotService.availableSlots(getAvailableSlotsInput);
  }
}
