import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';
import { SlotDayIsAvailableRule } from '../../rules/slot-day-is-available.rule';
import { SlotTimeIsBookableRule } from '../../rules/slot-time-is-bookable.rule';
import { SlotNotFallOnConfiguredBreaksRule } from '../../rules/slot-not-fall-on-configured-breaks.rule';
import { SlotNotFallOnPlannedOffRule } from '../../rules/slot-not-fall-on-planned-off.rule';
import { SlotIsAmongAvailableSlotsInDayRule } from '../../rules/slot-is-among-available-slots-in-day.rule';
import { SlotIsAfterNowRule } from '../../rules/slot-is-after-now.rule';
import { SlotIsNotBookedOutRule } from '../../rules/slot-is-not-booked-out.rule';
import * as moment from 'moment';
import { SlotHelper } from '../../../helpers/slot.helper';
import { Service } from '../../../service/service.entity';
import { Repository } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

interface SlotValidatorsPipeInterface {
  serviceId: number;
  startDate: string;
}

@Injectable()
export class SlotValidatorsPipe implements PipeTransform {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private slotHelper: SlotHelper,
  ) {}

  async transform(data: SlotValidatorsPipeInterface) {
    const service = await this.serviceRepository.findOne({
      where: {
        id: data.serviceId,
      },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    this.slotHelper = this.slotHelper
      .forService(service)
      .forSlot(moment(data.startDate));

    for (const validator of SlotValidatorsPipe.validators()) {
      const validatorInstance = this.moduleRef.get(validator, {
        strict: false,
      });
      const isValid = await validatorInstance.validate(data.startDate, {
        value: data.startDate,
        constraints: [],
        targetName: '',
        object: data,
        property: 'startDate',
      });

      if (!isValid) {
        throw new BadRequestException(validatorInstance.defaultMessage());
      }
    }

    return data;
  }

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
}
