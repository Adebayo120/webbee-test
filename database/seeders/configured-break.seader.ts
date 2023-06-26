import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from '../../src/modules/service/service.entity';
import { ConfiguredBreak } from '../../src/modules/configured-break/configured-break.entity';

interface ConfiguredBreakInsertFields {
  name: string;
  startHourInMinutes: number;
  endHourInMinutes: number;
  service: Service;
}

export default class ConfiguredBreakSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const services = await dataSource
      .getRepository(Service)
      .find({ where: { name: In(['Men Haircut', 'Women Haircut']) } });

    let data = [];
    services.forEach(
      (service: Service) => (data = [...data, ...this.getData(service)]),
    );

    const repository = dataSource.getRepository(ConfiguredBreak);

    await repository.insert(data);
  }

  private getData(service: Service): ConfiguredBreakInsertFields[] {
    return [
      {
        name: 'lunch break',
        startHourInMinutes: 720,
        endHourInMinutes: 780,
        service,
      },
      {
        name: 'cleaning break',
        startHourInMinutes: 900,
        endHourInMinutes: 960,
        service,
      },
    ];
  }
}
