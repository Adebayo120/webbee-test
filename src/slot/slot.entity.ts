import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Slot {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  type: string;
}
