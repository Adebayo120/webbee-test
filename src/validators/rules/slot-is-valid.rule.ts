import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import moment from 'moment';
import { SlotHelper } from 'src/helpers/slot.helper';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import { SlotIsAfterNowRule } from './slot-is-after-now.rule';
import { SlotIsAvailableRule } from './slot-is-available.rule';
import { ModuleRef } from '@nestjs/core';
import { BadRequestException, Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'SlotIsValid', async: true })
@Injectable()
export class SlotIsValidRule implements ValidatorConstraintInterface {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private slotHelper: SlotHelper,
  ) {}

  async validate(slot: number, args: ValidationArguments): Promise<boolean> {
    console.log('SlotIsValid');

    console.log(this.moduleRef.get(SlotHelper));

    const service = await this.serviceRepository.findOne({
      where: {
        id: 1,
      },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    // this.slotHelper = this.slotHelper
    //   .forService(service)
    //   .forSlot(moment.unix(slot));

    // for (const validator of this.validators()) {
    //   const validatorInstance = this.moduleRef.get(validator);
    //   const isValid = await validatorInstance.validate(slot, args);
    //   if (!isValid) {
    //     throw new BadRequestException(validatorInstance.defaultMessage());
    //   }
    // }

    return true;
  }

  defaultMessage() {
    return `Slot exceeds future bookable date`;
  }

  validators(): (new (...arg) => ValidatorConstraintInterface)[] {
    return [SlotIsAfterNowRule, SlotIsAvailableRule];
  }
}

export function SlotIsValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SlotIsValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SlotIsValidRule,
    });
  };
}
