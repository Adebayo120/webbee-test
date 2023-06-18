import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import BusinessAdministratorSeeder from './business_administrator.seeder';
import ServiceSeeder from './service.seeder';
import BookableCalenderSeeder from './bookable_calender.seeder';
import ConfiguredBreakSeeder from './configured_break.seader';
import PlannedOffSeeder from './planned_off.seeder';

export default class DatabaseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    for (const seeder of this.seeders) {
      await new seeder().run(dataSource, factoryManager);
    }
  }

  private get seeders(): (new () => Seeder)[] {
    return [
      BusinessAdministratorSeeder,
      ServiceSeeder,
      BookableCalenderSeeder,
      ConfiguredBreakSeeder,
      PlannedOffSeeder,
    ];
  }
}
