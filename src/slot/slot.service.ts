import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { SlotHelper } from './slot.helper';
import { Appointment } from 'src/appointment/appointment.entity';
import { SlotType } from './object-types/slot.type';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async availableSlots(
    getAvailableSlotsInput: GetAvailableSlotsInput,
  ): Promise<SlotType> {
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

    const startDate: moment.Moment = moment
      .unix(getAvailableSlotsInput.startDateInUnixTimestamp)
      .startOf('day');

    const endDate: moment.Moment = moment
      .unix(getAvailableSlotsInput.endDateInUnixTimestamp)
      .endOf('day');

    const slotHelper = await new SlotHelper()
      .whereBetween(startDate, endDate)
      .forService(service)
      .forAvailableBookableCalenders()
      .setBookedAppointmentsBetweenDates(this.appointmentRepository)
      .then((slotHelper: SlotHelper) => slotHelper.generateAvailableSlots());

    return {
      availableDates: slotHelper.getAvailableDates(),
      bookableDurationInMinutes: service.bookable_duration_in_minutes,
      availableSlots: slotHelper.getAvailableSlots(),
    };
  }
}
