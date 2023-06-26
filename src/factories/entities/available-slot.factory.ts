import { AvailableSlot } from '../../modules/slot/object-types/available-slot.type';
import { Factory } from '../factory.abstract';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';

export class AvailableSlotFactory extends Factory<AvailableSlot> {
  define(): AvailableSlot {
    const availableSlot = new AvailableSlot();
    availableSlot.startDate = moment().format();
    availableSlot.bookableAppointmentsCount = faker.number.int();

    return availableSlot;
  }
}
