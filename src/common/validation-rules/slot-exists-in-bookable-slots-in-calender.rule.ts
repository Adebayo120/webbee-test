import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SlotHelper } from 'src/slot/slot.helper';

@ValidatorConstraint({ name: 'SlotExistsInBookableSlotTime' })
export class SlotExistsInBookableSlotTimeRule
  implements ValidatorConstraintInterface
{
  validate(id: number, { object }: ValidationArguments): boolean {
    console.log('SlotExistsInBookableSlotTime');
    const slotHelper = object['slotHelper'] as SlotHelper;

    return slotHelper.existsInBookableSlots();
  }

  defaultMessage() {
    return `Slot does not fall on bookable slot time`;
  }
}

export function SlotExistsInBookableSlotTime(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotExistsInBookableSlotTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotExistsInBookableSlotTimeRule,
    });
  };
}
