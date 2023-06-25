import { faker } from '@faker-js/faker';
import { Appointment } from '../../appointment/appointment.entity';
import { Factory } from '../factory.abstract';
import * as moment from 'moment';
import { Service } from './../../service/service.entity';
import { ServiceFactory } from './service.factory';
import factory from '../factory.helper';

export class AppointmentFactory extends Factory<Appointment> {
  define(): Appointment {
    const appointment = new Appointment();
    appointment.firstName = faker.person.firstName();
    appointment.lastName = faker.person.lastName();
    appointment.email = faker.internet.email();
    appointment.startDate = moment().format();
    appointment.service = factory<Service>(ServiceFactory).make();
    appointment.endDate = moment()
      .add(appointment.service.bookableDurationInMinutes, 'm')
      .format();

    return appointment;
  }
}
