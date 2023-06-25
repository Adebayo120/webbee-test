import { faker } from '@faker-js/faker';
import { Service } from '../../service/service.entity';
import { Factory } from '../factory.abstract';
import { BusinessAdministrator } from './../../business-administrator/business-administrators.entity';
import factory from '../factory.helper';
import { BusinessAdministratorFactory } from './business-administrator.factory';

export class ServiceFactory extends Factory<Service> {
  define(): Service {
    const service = new Service();
    service.name = faker.word.noun();
    service.businessAdministrator = factory<BusinessAdministrator>(
      BusinessAdministratorFactory,
    ).make();
    service.bookableDurationInMinutes = 30;
    service.breakBetweenSlotsInMinutes = 0;
    service.futureBookableDays = 7;
    service.bookableAppointmentsPerSlotCount = 3;
    service.bookableCalenders = [];
    service.configuredBreaks = [];
    service.appointments = [];
    service.plannedOffs = [];

    return service;
  }
}
