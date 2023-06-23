import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SlotHelper } from 'src/helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotTimeIsBookable' })
@Injectable()
export class SlotTimeIsBookableRule implements ValidatorConstraintInterface {
  constructor(private slotHelper: SlotHelper) {}

  validate(): boolean {
    return this.slotHelper.timeIsBookable();
  }

  defaultMessage() {
    return `Sorry we do not operate at selected time`;
  }
}

export function SlotTimeIsBookable(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotTimeIsBookable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotTimeIsBookableRule,
    });
  };
}
