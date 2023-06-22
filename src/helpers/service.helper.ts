import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { Injectable, Scope } from '@nestjs/common';
import * as moment from 'moment';
import { Service } from '../service/service.entity';

@Injectable({ scope: Scope.REQUEST })
export class ServiceHelper {
  private service: Service;

  forService(service: Service): this {
    this.service = service;

    return this;
  }

  futureBookableDate(): moment.Moment {
    return moment().add(this.service.future_bookable_days, 'day').endOf('day');
  }

  hasFutureBookableDayLimit(): boolean {
    return !!this.service.future_bookable_days;
  }

  futureBookableDateIsSameOrAfter(date: moment.Moment): boolean {
    return this.futureBookableDate().isSameOrAfter(date);
  }

  bookableCalenderForSlotDate(
    startDate: moment.Moment,
  ): BookableCalender | null {
    const calenders = this.service.bookableCalenders.filter(
      (calender: BookableCalender) => {
        calender.day === startDate.day();
      },
    );

    return calenders.length ? calenders[0] : null;
  }
}
