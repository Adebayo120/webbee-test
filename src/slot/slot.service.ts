import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Slot } from './object-types/slot.type';
import { SlotHelper } from 'src/helpers/slot.helper';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private slotHelper: SlotHelper,
  ) {}

  async availableSlots(
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<Slot> {
    const service = await this.serviceRepository.findOne({
      where: {
        id: getAvailableSlotsInput.serviceId,
      },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    const startDate: moment.Moment = moment(
      getAvailableSlotsInput.startDate,
    ).startOf('day');

    const endDate: moment.Moment = moment(getAvailableSlotsInput.endDate).endOf(
      'day',
    );

    const slotHelper = await this.slotHelper
      .whereBetween(startDate, endDate)
      .forService(service)
      .forAvailableBookableCalenders()
      .setBookedAppointmentsBetweenDates()
      .then((slotHelper: SlotHelper) => slotHelper.generateAvailableSlots());

    return {
      availableDates: slotHelper.getAvailableDates(),
      bookableDurationInMinutes: service.bookableDurationInMinutes,
      availableSlots: slotHelper.getAvailableSlots(),
    };
  }
}
