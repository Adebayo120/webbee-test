import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from './../../helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotNotFallOnPlannedOff' })
@Injectable()
export class SlotNotFallOnPlannedOffRule
  implements ValidatorConstraintInterface
{
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return !this.slotHelper.fallOnPlannedOffDate();
  }

  defaultMessage() {
    return `Slot falls on planned off date`;
  }
}

export function SlotNotFallOnPlannedOff(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotNotFallOnPlannedOff',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotNotFallOnPlannedOffRule,
    });
  };
}
