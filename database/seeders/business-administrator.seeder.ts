import { BusinessAdministrator } from '../../src/modules/business-administrator/business-administrators.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class BusinessAdministratorSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(BusinessAdministrator);
    await repository.insert({ name: 'Hair Saloon' });
  }
}
