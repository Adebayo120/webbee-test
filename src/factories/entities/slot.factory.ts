import { Slot } from './../../slot/object-types/slot.type';
import { Factory } from '../factory.abstract';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import factory from '../factory.helper';
import { AvailableSlot } from './../../slot/object-types/available-slot.type';
import { AvailableSlotFactory } from './available-slot.factory';

export class SlotFactory extends Factory<Slot> {
  define(): Slot {
    const slot = new Slot();
    slot.availableDates = [moment().format()];
    slot.bookableDurationInMinutes = faker.number.int();
    slot.availableSlots = [factory<AvailableSlot>(AvailableSlotFactory).make()];
    return slot;
  }
}
