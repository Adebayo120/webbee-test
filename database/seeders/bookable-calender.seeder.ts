import { Seeder } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from 'src/service/service.entity';
import { DaysOfTheWeekEnum } from 'src/bookable-calender/enums/days-of-the-week.enums';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';

interface BookableCalenderInsertFields {
  day: Number;
  opening_hour_in_minutes: Number;
  closing_hour_in_minutes: Number;
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
        opening_hour_in_minutes: null,
        closing_hour_in_minutes: null,
        available: false,
        service,
      },
      {
        day: DaysOfTheWeekEnum.MONDAY,
        opening_hour_in_minutes: 480,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.TUESDAY,
        opening_hour_in_minutes: 480,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.WEDNESDAY,
        opening_hour_in_minutes: 480,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.THURSDAY,
        opening_hour_in_minutes: 480,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.FRIDAY,
        opening_hour_in_minutes: 480,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
      {
        day: DaysOfTheWeekEnum.SATURDAY,
        opening_hour_in_minutes: 600,
        closing_hour_in_minutes: 1320,
        available: true,
        service,
      },
    ];
  }
}
