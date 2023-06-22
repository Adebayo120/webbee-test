import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/validators/rules/exists.rule';
import { Service } from 'src/service/service.entity';
import { MinDigitLength } from 'src/validators/rules/min-digit-length.rule';
import { LessThanOrEqualTo } from 'src/validators/rules/less-than-or-equal-to.rule';
import { GreaterThanOrEqualTo } from 'src/validators/rules/greater-than-or-equal-to.rule';
@InputType()
export class GetAvailableSlotsInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @MinDigitLength(10)
  @LessThanOrEqualTo('endDateInUnixTimestamp')
  @Field((type) => Int)
  startDateInUnixTimestamp: number;

  @MinDigitLength(10)
  @GreaterThanOrEqualTo('startDateInUnixTimestamp')
  @Field((type) => Int)
  endDateInUnixTimestamp: number;
}
