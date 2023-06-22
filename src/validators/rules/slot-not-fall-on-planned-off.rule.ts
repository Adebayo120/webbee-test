import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SlotHelper } from 'src/helpers/slot.helper';

@ValidatorConstraint({ name: 'SlotNotFallOnPlannedOff' })
export class SlotNotFallOnPlannedOffRule
  implements ValidatorConstraintInterface
{
  validate(id: number, { object }: ValidationArguments): boolean {
    console.log('SlotNotFallOnPlannedOff');
    const slotHelper = object['slotHelper'] as SlotHelper;

    return !slotHelper.fallOnPlannedOffDate();
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
