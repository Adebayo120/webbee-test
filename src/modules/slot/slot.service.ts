import { GetAvailableSlotsInput } from './dtos/get-available-slots.input';
import { Injectable } from '@nestjs/common';
import { Slot } from './object-types/slot.type';
import { SlotHelper } from '../../helpers/slot.helper';

@Injectable()
export class SlotService {
  constructor(private slotHelper: SlotHelper) {}

  async availableSlots(data: GetAvailableSlotsInput): Promise<Slot> {
    const slotHelper = await this.slotHelper
      .whereBetween(data.startDate, data.endDate)
      .forService(data.service)
      .forAvailableBookableCalenders()
      .setBookedAppointmentsBetweenDates();

    slotHelper.generateAvailableSlots();

    return {
      availableDates: slotHelper.getAvailableDates(),
      bookableDurationInMinutes: data.service.bookableDurationInMinutes,
      availableSlots: slotHelper.getAvailableSlots(),
    };
  }
}
