import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from '../../../validators/rules/exists.rule';
import { Service } from '../../service/service.entity';
import { DateStringIsSameOrAfter } from '../../../validators/rules/date-string-is-same-or-after.rule';
import { IsIsoDateString } from '../../../validators/rules/is-iso-string.rule';
import { DateStringIsSameOrBefore } from '../../../validators/rules/date-string-is-same-or-before.rule';
import * as moment from 'moment';
@InputType()
export class GetAvailableSlotsInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @DateStringIsSameOrBefore('endDateString')
  @IsIsoDateString()
  @Field()
  startDateString: string;

  @DateStringIsSameOrAfter('startDateString')
  @IsIsoDateString()
  @Field()
  endDateString: string;

  service?: Service;

  startDate?: moment.Moment;

  endDate?: moment.Moment;
}
