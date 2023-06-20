import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BookableCalender } from 'src/bookable-calender/bookable-calender.entity';
import { ConfiguredBreakHelper } from 'src/configured-break/configured-break.helper';
import { Service } from 'src/service/service.entity';
import { ServiceHelper } from 'src/service/service.helper';

@Injectable()
export class SlotHelper {
  private startDate = moment().startOf('d');

  private endDate: moment.Moment;

  private service: Service;

  private serviceHelper: ServiceHelper;

  private configuredBreak: ConfiguredBreakHelper;

  private availableBookableCalenders: BookableCalender;

  whereBetween(startDate: moment.Moment, endDate: moment.Moment): this {
    this.startDate = startDate;

    this.endDate = endDate;

    return this;
  }

  forService(service: Service): this {
    this.service = service;

    this.serviceHelper = new ServiceHelper().forService(service);

    this.configuredBreak = new ConfiguredBreakHelper().forService(service);

    if (this.endDate === undefined) {
      this.endDate = this.serviceHelper.futureBookableDate();
    }

    return this;
  }

  async forAvailableBookableCalenders(): Promise<this> {
    const availableBookableCalenders = await this.service.bookableCalenders;

    console.log(availableBookableCalenders);

    // this.availableBookableCalenders = availableBookableCalenders.filter( calender => {
    //     return this.startDate.diffInDaysFiltered(function (Carbon $date) use($calender){
    //         return $date.dayOfWeek == $calender.day;
    //     }, this.endDate);
    // });

    return this;
  }
}
