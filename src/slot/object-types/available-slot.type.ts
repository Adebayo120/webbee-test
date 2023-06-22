import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('AvailableSlot')
export class AvailableSlot {
  @Field()
  startDate: string;

  @Field((type) => Int)
  bookableAppointmentsCount: number;
}
