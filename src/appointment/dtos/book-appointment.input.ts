import { SlotHelper } from 'src/slot/slot.helper';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Exists } from 'src/common/validation-rules/exists.rule';
import { MinDigitLength } from 'src/common/validation-rules/min-digit-length.rule';
import { Service } from 'src/service/service.entity';
import { ProfileInput } from './profile.input';
import { ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SlotIsAfterNow } from 'src/common/validation-rules/slot-is-after-now.rule';
import { SlotIsAvailable } from 'src/common/validation-rules/slot-is-available.rule';
import { SlotExistsInCalender } from 'src/common/validation-rules/slot-exists-in-calender.rule';
import { SlotNotFallOnPlannedOff } from 'src/common/validation-rules/slot-not-fall-on-planned-off.rule';
import { SlotFallsOnFutureBookableDate } from 'src/common/validation-rules/slot-falls-on-future-bookable-date.rule';
import { SlotNotFallOnConfiguredBreaks } from 'src/common/validation-rules/slot-not-fall-on-configured-breaks.rule';
import { SlotExistsInBookableSlotTime } from 'src/common/validation-rules/slot-exists-in-bookable-slots-in-calender.rule';

@InputType()
export class BookAppointmentInput {
  constructor(public slotHelper: SlotHelper) {}

  @Exists(Service, 'id')
  @Field((type) => Int)
  serviceId: number;

  @ValidateNested({ each: true })
  @Type(() => ProfileInput)
  @Field((type) => [ProfileInput!]!)
  profiles: ProfileInput[];

  @SlotExistsInCalender()
  @SlotIsAvailable()
  @SlotIsAfterNow()
  @MinDigitLength(10)
  @Transform(async ({ value, key, obj, type }) => {
    console.log('first of all');
    await setTimeout(() => {
      console.log('inside promise');
    }, 2000);
    return 122;
  })
  @Field((type) => Int)
  startDateInUnixTimestamp: number;
}
