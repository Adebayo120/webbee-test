import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Appointment } from 'src/appointment/appointment.entity';
import { SlotHelper } from 'src/helpers/slot.helper';
// import { SlotHelper } from 'src/slot/slot.helper';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'SlotIsAvailable', async: true })
export class SlotIsAvailableRule implements ValidatorConstraintInterface {
  constructor(private slotHelper: SlotHelper) {}

  async validate(
    slot: number,
    { object }: ValidationArguments,
  ): Promise<boolean> {
    console.log('SlotIsAvailable');
    // const slotHelper = object['slotHelper'] as SlotHelper;

    // const isAvailable = slotHelper
    //   .setAppointmentRepository(this.appointmentRepository)
    //   .isAvailable(object['profiles'].length);
    console.log(this.slotHelper);

    return false;
  }

  defaultMessage() {
    return `Slot is not available`;
  }
}

export function SlotIsAvailable(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotIsAvailable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotIsAvailableRule,
    });
  };
}
