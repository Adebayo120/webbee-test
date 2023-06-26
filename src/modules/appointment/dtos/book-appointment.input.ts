import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from '../../../validators/rules/exists.rule';
import { Service } from '../../service/service.entity';
import { ProfileInput } from './profile.input';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsIsoDateString } from '../../../validators/rules/is-iso-string.rule';

@InputType()
export class BookAppointmentInput {
  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @ValidateNested({ each: true })
  @Type(() => ProfileInput)
  @Field((type) => [ProfileInput!]!)
  profiles: ProfileInput[];

  @IsIsoDateString()
  @Field()
  startDate: string;
}
