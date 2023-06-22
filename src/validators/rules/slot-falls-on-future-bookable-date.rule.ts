import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SlotHelper } from 'src/helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotFallsOnFutureBookableDate' })
export class SlotFallsOnFutureBookableDateRule
  implements ValidatorConstraintInterface
{
  validate(id: number, { object }: ValidationArguments): boolean {
    console.log('SlotFallsOnFutureBookableDate');
    const slotHelper = object['slotHelper'] as SlotHelper;

    return slotHelper.fallBetweenFutureBookableDate();
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
