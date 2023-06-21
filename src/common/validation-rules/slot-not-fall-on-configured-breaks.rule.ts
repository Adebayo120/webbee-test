import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SlotHelper } from 'src/slot/slot.helper';

@ValidatorConstraint({ name: 'SlotNotFallOnConfiguredBreaks' })
export class SlotNotFallOnConfiguredBreaksRule
  implements ValidatorConstraintInterface
{
  validate(id: number, { object }: ValidationArguments): boolean {
    console.log('SlotNotFallOnConfiguredBreaks');
    const slotHelper = object['slotHelper'] as SlotHelper;

    return !slotHelper.fallBetweenConfiguredBreaks();
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
