import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/validators/rules/exists.rule';
import { Service } from 'src/service/service.entity';
import { ProfileInput } from './profile.input';
import { ValidateNested } from 'class-validator';
import { MinDigitLength } from 'src/validators/rules/min-digit-length.rule';
import { SlotIsValid } from 'src/validators/rules/slot-is-valid.rule';
import { Type } from 'class-transformer';
import { SlotIsAfterNow } from 'src/validators/rules/slot-is-after-now.rule';

@InputType()
export class BookAppointmentInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @ValidateNested({ each: true })
  @Type(() => ProfileInput)
  @Field((type) => [ProfileInput!]!)
  profiles: ProfileInput[];

  @SlotIsAfterNow()
  @MinDigitLength(10)
  @Field((type) => Int)
  startDateInUnixTimestamp: number;
}
