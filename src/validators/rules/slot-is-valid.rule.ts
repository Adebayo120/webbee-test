import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';
import { SlotHelper } from './../../helpers/slot.helper';
import { Service } from './../../service/service.entity';
import { Repository } from 'typeorm';
import { SlotIsAfterNowRule } from './slot-is-after-now.rule';
import { SlotIsNotBookedOutRule } from './slot-is-not-booked-out.rule';
import { ModuleRef } from '@nestjs/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SlotDayIsAvailableRule } from './slot-day-is-available.rule';
import { SlotTimeIsBookableRule } from './slot-time-is-bookable.rule';
import { SlotNotFallOnConfiguredBreaksRule } from './slot-not-fall-on-configured-breaks.rule';
import { SlotNotFallOnPlannedOffRule } from './slot-not-fall-on-planned-off.rule';
import { SlotIsAmongAvailableSlotsInDayRule } from './slot-is-among-available-slots-in-day.rule';

@ValidatorConstraint({ name: 'SlotIsValid', async: true })
@Injectable()
export class SlotIsValidRule implements ValidatorConstraintInterface {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private slotHelper: SlotHelper,
  ) {}

  static validators(): (new (...arg) => ValidatorConstraintInterface)[] {
    return [
      SlotIsAfterNowRule,
      SlotDayIsAvailableRule,
      SlotTimeIsBookableRule,
      SlotIsNotBookedOutRule,
      SlotNotFallOnConfiguredBreaksRule,
      SlotNotFallOnPlannedOffRule,
      SlotIsAmongAvailableSlotsInDayRule,
    ];
  }

  async validate(slot: string, args: ValidationArguments): Promise<boolean> {
    const service = await this.serviceRepository.findOne({
      where: {
        id: args.object['serviceId'],
      },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    this.slotHelper = this.slotHelper.forService(service).forSlot(moment(slot));

    for (const validator of SlotIsValidRule.validators()) {
      const validatorInstance = this.moduleRef.get(validator);
      const isValid = await validatorInstance.validate(slot, args);
      if (!isValid) {
        throw new BadRequestException(validatorInstance.defaultMessage());
      }
    }

    return true;
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
