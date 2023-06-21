import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SlotHelper } from 'src/slot/slot.helper';

@ValidatorConstraint({ name: 'SlotExistsInCalender' })
export class SlotExistsInCalenderRule implements ValidatorConstraintInterface {
  validate(id: number, { object }: ValidationArguments): boolean {
    console.log('SlotExistsInCalender');
    const slotHelper = object['slotHelper'] as SlotHelper;
    console.log(slotHelper);
    return slotHelper.existsInBookableCalender();
  }

  defaultMessage() {
    return `Slot is not available`;
  }
}

export function SlotExistsInCalender(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotExistsInCalender',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotExistsInCalenderRule,
    });
  };
}
