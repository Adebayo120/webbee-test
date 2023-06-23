import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/validators/rules/exists.rule';
import { Service } from 'src/service/service.entity';
import { DateStringIsSameOrAfter } from 'src/validators/rules/date-string-is-same-or-after.rule';
import { IsIsoDateString } from 'src/validators/rules/is-iso-string.rule';
import { DateStringIsSameOrBefore } from 'src/validators/rules/date-string-is-same-or-before.rule';
@InputType()
export class GetAvailableSlotsInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @DateStringIsSameOrBefore('endDate')
  @IsIsoDateString()
  @Field()
  startDate: string;

  @DateStringIsSameOrAfter('startDate')
  @IsIsoDateString()
  @Field()
  endDate: string;
}
