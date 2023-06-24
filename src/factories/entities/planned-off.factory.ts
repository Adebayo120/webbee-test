import { PlannedOff } from '../../planned-off/planned-off.entity';
import { Factory } from '../factory.abstract';
import * as moment from 'moment';
import { Service } from './../../service/service.entity';
import { ServiceFactory } from './service.factory';
import factory from '../factory.helper';

export class PlannedOffFactory extends Factory<PlannedOff> {
  define(): PlannedOff {
    const plannedOff = new PlannedOff();
    plannedOff.startDate = moment().startOf('day').add(480, 'm').format();
    plannedOff.endDate = moment().startOf('day').add(600, 'm').format();
    plannedOff.service = factory<Service>(ServiceFactory).make();

    return plannedOff;
  }
}
