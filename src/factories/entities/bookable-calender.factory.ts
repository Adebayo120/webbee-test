import { BookableCalender } from '../../bookable-calender/bookable-calender.entity';
import { Factory } from '../factory.abstract';
import { Service } from './../../service/service.entity';
import { ServiceFactory } from './service.factory';
import factory from '../factory.helper';
import { DaysOfTheWeekEnum } from './../../bookable-calender/enums/days-of-the-week.enums';

export class BookableCalenderFactory extends Factory<BookableCalender> {
  define(): BookableCalender {
    const bookableCalender = new BookableCalender();
    bookableCalender.day = DaysOfTheWeekEnum.MONDAY;
    bookableCalender.openingHourInMinutes = 480;
    bookableCalender.closingHourInMinutes = 600;
    bookableCalender.available = true;
    bookableCalender.service = factory<Service>(ServiceFactory).make();

    return bookableCalender;
  }
}
