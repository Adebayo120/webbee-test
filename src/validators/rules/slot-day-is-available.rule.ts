import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from './../../helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotDayIsAvailable' })
@Injectable()
export class SlotDayIsAvailableRule implements ValidatorConstraintInterface {
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return this.slotHelper.belongsToAnAvailableBookableDay();
  }

  defaultMessage() {
    return `Selected day is not available`;
  }
}

export function SlotDayIsAvailable(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotDayIsAvailable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotDayIsAvailableRule,
    });
  };
}
