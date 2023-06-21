import { SlotHelper } from 'src/slot/slot.helper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'SlotIsAfterNow', async: true })
@Injectable()
export class SlotIsAfterNowRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async validate(slot: number, { object }: ValidationArguments) {
    console.log('SlotIsAfterNow');
    const service = await this.serviceRepository.findOne({
      where: { id: object['serviceId'] },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    const slotHelper = new SlotHelper()
      .forService(service)
      .forSlot(moment.unix(slot));

    object['slotHelper'] = slotHelper;
    console.log('got here in SlotIsAfterNow');
    return slotHelper.startDateIsAfterNow();
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
