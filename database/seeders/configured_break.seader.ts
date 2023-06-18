import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from 'src/service/service.entity';
import { ConfiguredBreak } from 'src/configured_break/configured_breaks.entity';

interface ConfiguredBreakInsertFields {
  name: string;
  start_hour_in_minutes: Number;
  end_hour_in_minutes: Number;
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
        start_hour_in_minutes: 720,
        end_hour_in_minutes: 780,
        service,
      },
      {
        name: 'cleaning break',
        start_hour_in_minutes: 900,
        end_hour_in_minutes: 960,
        service,
      },
    ];
  }
}
