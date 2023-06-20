import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/common/validation-rules/exists.rule';
import { GreaterThanOrEqualTo } from 'src/common/validation-rules/greater-than-or-equal-to.rule';
import { LessThanOrEqualTo } from 'src/common/validation-rules/less-than-or-equal-to.rule';
import { Service } from 'src/service/service.entity';
@InputType()
export class GetAvailableSlotsInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @LessThanOrEqualTo('end_date_in_unix_timestamp')
  @Field((type) => Int)
  start_date_in_unix_timestamp: number;

  @GreaterThanOrEqualTo('start_date_in_unix_timestamp')
  @Field((type) => Int)
  end_date_in_unix_timestamp: number;
}
