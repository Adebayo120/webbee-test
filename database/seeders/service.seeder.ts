import { BusinessAdministrator } from '../../src/business-administrator/business-administrators.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Service } from 'src/service/service.entity';

export default class ServiceSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const administrator = await dataSource
      .getRepository(BusinessAdministrator)
      .findOneBy({ name: 'Hair Saloon' });

    const repository = dataSource.getRepository(Service);
    await repository.insert([
      {
        name: 'Men Haircut',
        businessAdministrator: administrator,
        bookableDurationInMinutes: 10,
        breakBetweenSlotsInMinutes: 5,
        futureBookableDays: 7,
        bookableAppointmentsPerSlotCount: 3,
      },
      {
        name: 'Women Haircut',
        businessAdministrator: administrator,
        bookableDurationInMinutes: 60,
        breakBetweenSlotsInMinutes: 10,
        futureBookableDays: 7,
        bookableAppointmentsPerSlotCount: 3,
      },
    ]);
  }
}
