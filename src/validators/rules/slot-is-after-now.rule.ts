import { SlotHelper } from './../../helpers/slot.helper';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'SlotIsAfterNow' })
@Injectable()
export class SlotIsAfterNowRule implements ValidatorConstraintInterface {
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return this.slotHelper.startDateIsAfterNow();
  }

  defaultMessage() {
    return `Cannot book past slot date`;
  }
}

export function SlotIsAfterNow(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotIsAfterNow',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotIsAfterNowRule,
    });
  };
}
