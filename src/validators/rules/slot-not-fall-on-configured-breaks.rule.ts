import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from 'src/helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotNotFallOnConfiguredBreaks' })
@Injectable()
export class SlotNotFallOnConfiguredBreaksRule
  implements ValidatorConstraintInterface
{
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return !this.slotHelper.fallOnConfiguredBreaks();
  }

  defaultMessage() {
    return `Slot falls on configured break time`;
  }
}

export function SlotNotFallOnConfiguredBreaks(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotNotFallOnConfiguredBreaks',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotNotFallOnConfiguredBreaksRule,
    });
  };
}
