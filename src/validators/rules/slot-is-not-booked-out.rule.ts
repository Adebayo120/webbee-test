import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from './../../helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotIsNotBookedOut', async: true })
@Injectable()
export class SlotIsNotBookedOutRule implements ValidatorConstraintInterface {
  constructor(private slotHelper: SlotHelper) {}

  async validate(
    __: number,
    { object }: ValidationArguments,
  ): Promise<boolean> {
    return this.slotHelper.isNotBookedOut(object['profiles'].length);
  }

  defaultMessage() {
    return `Slot is booked out`;
  }
}

export function SlotIsNotBookedOut(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotIsNotBookedOut',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotIsNotBookedOutRule,
    });
  };
}
