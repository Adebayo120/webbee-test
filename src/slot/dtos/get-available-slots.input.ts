import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetAvailableSlotsInput {
  @Field((type) => Int)
  serviceId: Number;

  @Field((type) => Int)
  start_date_in_unix_timestamp: number;

  @Field((type) => Int)
  end_date_in_unix_timestamp: number;
}
