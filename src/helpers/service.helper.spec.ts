import { BusinessAdministrator } from 'src/business-administrator/business-administrators.entity';
import { Service } from 'src/service/service.entity';

export const administrator: BusinessAdministrator = {
  id: 1,
  name: 'Hair Saloon',
  services: [],
};

export const fakeService: Service = {
  id: 1,
  name: 'Men Haircut',
  businessAdministrator: administrator,
  bookableDurationInMinutes: 10,
  breakBetweenSlotsInMinutes: 5,
  futureBookableDays: 7,
  bookableAppointmentsPerSlotCount: 3,
  bookableCalenders: [],
  configuredBreaks: [],
  plannedOffs: [],
  appointments: [],
};
