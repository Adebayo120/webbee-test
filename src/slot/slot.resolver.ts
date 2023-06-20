import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { AvailableSlot } from './available-slot.entity';
import { SlotService } from './slot.service';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver((of) => AvailableSlot)
export class SlotResolver {
  constructor(private slotService: SlotService) {}

  @Query((returns) => [AvailableSlot])
  availableSlots(
    @Args('getAvailableSlotsInput')
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<AvailableSlot[]> {
    return this.slotService.availableSlots(getAvailableSlotsInput);
  }
}
