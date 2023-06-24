import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from './../../helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotFallsOnFutureBookableDate' })
@Injectable()
export class SlotFallsOnFutureBookableDateRule
  implements ValidatorConstraintInterface
{
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return this.slotHelper.fallBetweenFutureBookableDate();
  }

  defaultMessage() {
    return `Slot exceeds future bookable date`;
  }
}

export function SlotFallsOnFutureBookableDate(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotFallsOnFutureBookableDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotFallsOnFutureBookableDateRule,
    });
  };
}
