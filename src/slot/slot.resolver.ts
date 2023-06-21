import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { SlotType } from './object-types/slot.type';
import { SlotService } from './slot.service';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver((of) => SlotType)
export class SlotResolver {
  constructor(private slotService: SlotService) {}

  @Query((returns) => SlotType)
  availableSlots(
    @Args('getAvailableSlotsInput')
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<SlotType> {
    return this.slotService.availableSlots(getAvailableSlotsInput);
  }
}
