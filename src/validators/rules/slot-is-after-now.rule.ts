import { SlotHelper } from 'src/helpers/slot.helper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  validate,
} from 'class-validator';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { SlotIsAvailable, SlotIsAvailableRule } from './slot-is-available.rule';
import { Appointment } from 'src/appointment/appointment.entity';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ name: 'SlotIsAfterNow'})
@Injectable()
export class SlotIsAfterNowRule implements ValidatorConstraintInterface {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private slotHelper: SlotHelper,
  ) {}

  validate(slot: number, args: ValidationArguments) {
    console.log('SlotIsAfterNow');
    console.log(this.slotHelper);
    console.log(this.moduleRef);
    console.log(this.serviceRepository);
    // const service = await this.serviceRepository.findOne({
    //   where: { id: object['serviceId'] },
    //   relations: {
    //     bookableCalenders: true,
    //     configuredBreaks: true,
    //     plannedOffs: true,
    //   },
    // });

    // const slotHelper = new SlotHelper()
    //   .forService(service)
    //   .forSlot(moment.unix(slot));

    // object['slotHelper'] = slotHelper;
    console.log('got here in SlotIsAfterNow');
    return true;
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
