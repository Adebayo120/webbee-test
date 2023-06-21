import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/common/validation-rules/exists.rule';
import { GreaterThanOrEqualTo } from 'src/common/validation-rules/greater-than-or-equal-to.rule';
import { LessThanOrEqualTo } from 'src/common/validation-rules/less-than-or-equal-to.rule';
import { MinDigitLength } from 'src/common/validation-rules/min-digit-length.rule';
import { Service } from 'src/service/service.entity';
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
