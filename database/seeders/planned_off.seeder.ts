import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from 'src/service/service.entity';
import * as moment from 'moment';
import { PlannedOff } from 'src/planned_off/planned_off.entity';

interface PlannedOffInsertFields {
  start_date: String;
  end_date: String;
  service: Service;
}

export default class PlannedOffSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const services = await dataSource
      .getRepository(Service)
      .find({ where: { name: In(['Men Haircut', 'Women Haircut']) } });

    let data = [];
    services.forEach(
      (service: Service) => (data = [...data, ...this.getData(service)]),
    );

    const repository = dataSource.getRepository(PlannedOff);

    await repository.insert(data);
  }

  private getData(service: Service): PlannedOffInsertFields[] {
    return [
      {
        start_date: moment().add(3, 'd').startOf('d').format(),
        end_date: moment().add(3, 'd').endOf('d').format(),
        service,
      },
    ];
  }
}
