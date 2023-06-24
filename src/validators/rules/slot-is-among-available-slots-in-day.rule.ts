import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from './../../helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotIsAmongAvailableSlotsInDay' })
@Injectable()
export class SlotIsAmongAvailableSlotsInDayRule
  implements ValidatorConstraintInterface
{
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return this.slotHelper.isAmongAvailableSlotsInDay();
  }

  defaultMessage() {
    return `Slot is not available`;
  }
}

export function SlotIsAmongAvailableSlotsInDay(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotIsAmongAvailableSlotsInDay',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotIsAmongAvailableSlotsInDayRule,
    });
  };
}
