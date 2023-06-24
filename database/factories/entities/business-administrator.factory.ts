import { faker } from '@faker-js/faker';
import { BusinessAdministrator } from '../../../src/business-administrator/business-administrators.entity';
import { Factory } from '../factory.abstract';

export class BusinessAdministratorFactory extends Factory<BusinessAdministrator> {
  define(): BusinessAdministrator {
    const administrator = new BusinessAdministrator();
    administrator.name = faker.person.fullName();
    return administrator;
  }
}
