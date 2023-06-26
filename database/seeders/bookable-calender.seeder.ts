import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from '../../src/modules/service/service.entity';
import { DaysOfTheWeekEnum } from '../../src/modules/bookable-calender/enums/days-of-the-week.enums';
import { BookableCalender } from '../../src/modules/bookable-calender/bookable-calender.entity';

interface BookableCalenderInsertFields {
  day: Number;
  openingHourInMinutes: Number;
  closingHourInMinutes: Number;
  available: Boolean;
  service: Service;
}

export default class BookableCalenderSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const services = await dataSource
      .getRepository(Service)
      .find({ where: { name: In(['Men Haircut', 'Women Haircut']) } });

    let data = [];
    services.forEach(
      (service: Service) => (data = [...data, ...this.getData(service)]),
    );

    const repository = dataSource.getRepository(BookableCalender);

    await repository.insert(data);
  }

  private getData(service: Service): BookableCalenderInsertFields[] {
    return [
      {
        day: DaysOfTheWeekEnum.SUNDAY,
        openingHourInMinutes: null,
        closingHourInMinutes: null,
        available: false,
        service,
      },
      {
        day: DaysOfTheWeekEnum.MONDAY,
        openingHourInMinutes: 480,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.TUESDAY,
        openingHourInMinutes: 480,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.WEDNESDAY,
        openingHourInMinutes: 480,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.THURSDAY,
        openingHourInMinutes: 480,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.FRIDAY,
        openingHourInMinutes: 480,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.SATURDAY,
        openingHourInMinutes: 600,
        closingHourInMinutes: 1320,
        available: true,
        service,
      },
    ];
  }
}
