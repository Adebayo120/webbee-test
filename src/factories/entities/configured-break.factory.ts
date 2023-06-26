import { faker } from '@faker-js/faker';
import { ConfiguredBreak } from '../../modules/configured-break/configured-break.entity';
import { Factory } from '../factory.abstract';
import { Service } from '../../modules/service/service.entity';
import { ServiceFactory } from './service.factory';
import factory from '../factory.helper';

export class ConfiguredBreakFactory extends Factory<ConfiguredBreak> {
  define(): ConfiguredBreak {
    const configuredBreak = new ConfiguredBreak();
    configuredBreak.name = faker.company.name();
    configuredBreak.startHourInMinutes = 720;
    configuredBreak.endHourInMinutes = 780;
    configuredBreak.service = factory<Service>(ServiceFactory).make();

    return configuredBreak;
  }
}
