import { BusinessAdministrator } from '../../src/business_administrator/business_administrators.entity';
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
        bookable_duration_in_minutes: 10,
        break_between_slots_in_minutes: 5,
        future_bookable_days: 7,
        bookable_appointments_per_slot_count: 3,
      },
      {
        name: 'Women Haircut',
        businessAdministrator: administrator,
        bookable_duration_in_minutes: 60,
        break_between_slots_in_minutes: 10,
        future_bookable_days: 7,
        bookable_appointments_per_slot_count: 3,
      },
    ]);
  }
}
