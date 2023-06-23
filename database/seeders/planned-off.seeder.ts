import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from 'src/service/service.entity';
import * as moment from 'moment';
import { PlannedOff } from 'src/planned-off/planned-off.entity';

interface PlannedOffInsertFields {
  startDate: String;
  endDate: String;
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
        startDate: moment().add(3, 'day').startOf('day').format(),
        endDate: moment().add(3, 'day').endOf('day').format(),
        service,
      },
    ];
  }
}
