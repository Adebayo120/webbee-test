import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/validators/rules/exists.rule';
import { Service } from 'src/service/service.entity';
import { ProfileInput } from './profile.input';
import { ValidateNested } from 'class-validator';
import { SlotIsValid } from 'src/validators/rules/slot-is-valid.rule';
import { Type } from 'class-transformer';
import { IsIsoDateString } from 'src/validators/rules/is-iso-string.rule';

@InputType()
export class BookAppointmentInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @ValidateNested({ each: true })
  @Type(() => ProfileInput)
  @Field((type) => [ProfileInput!]!)
  profiles: ProfileInput[];

  @SlotIsValid()
  @IsIsoDateString()
  @Field()
  startDate: string;
}
