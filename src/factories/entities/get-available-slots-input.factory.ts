import { Factory } from '../factory.abstract';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import { GetAvailableSlotsInput } from './../../slot/dtos/get-available-slots.input';

export class GetAvailableSlotsInputFactory extends Factory<GetAvailableSlotsInput> {
  define(): GetAvailableSlotsInput {
    const getavailableSlotsInput = new GetAvailableSlotsInput();
    getavailableSlotsInput.serviceId = faker.number.int();
    getavailableSlotsInput.startDateString = moment().format();
    getavailableSlotsInput.endDateString = moment().format();

    return getavailableSlotsInput;
  }
}
