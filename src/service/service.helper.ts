import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Service } from './service.entity';

@Injectable()
export class ServiceHelper {
  private service: Service;

  forService(service: Service): this {
    this.service = service;

    return this;
  }

  futureBookableDate(): moment.Moment {
    return moment().add(this.service.future_bookable_days, 'day').endOf('day');
  }
}
