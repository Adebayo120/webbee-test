import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Injectable } from '@nestjs/common';
import { AvailableSlot } from './available-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { SlotHelper } from './slot.helper';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async availableSlots(
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<AvailableSlot[]> {
    const service = await this.serviceRepository.findOneBy({
      id: getAvailableSlotsInput.serviceId,
    });

    const startDate: moment.Moment = moment.unix(
      getAvailableSlotsInput.start_date_in_unix_timestamp,
    );

    const endDate: moment.Moment = moment.unix(
      getAvailableSlotsInput.end_date_in_unix_timestamp,
    );

    const slotHelper = new SlotHelper()
      .whereBetween(startDate, endDate)
      .forService(service);

    console.log(slotHelper);

    const availableSlot = new AvailableSlot();
    availableSlot.id = getAvailableSlotsInput.serviceId;
    availableSlot.name = 'Adam';

    return [availableSlot];
  }
}
