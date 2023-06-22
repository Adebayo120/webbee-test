import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AvailableSlot } from './available-slot.type';

@ObjectType('Slot')
export class Slot {
  @Field((type) => [String]!)
  availableDates: string[];

  @Field((type) => Int)
  bookableDurationInMinutes: number;

  @Field((type) => [AvailableSlot]!)
  availableSlots: AvailableSlot[];
}
