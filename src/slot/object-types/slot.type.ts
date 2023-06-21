import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AvailableSlotType } from './available-slot.type';

@ObjectType('Slot')
export class SlotType {
  @Field((type) => [String]!)
  availableDates: string[];

  @Field((type) => Int)
  bookableDurationInMinutes: number;

  @Field((type) => [AvailableSlotType]!)
  availableSlots: AvailableSlotType[];
}
