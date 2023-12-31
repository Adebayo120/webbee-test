import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PlannedOff } from '../modules/planned-off/planned-off.entity';
import { Service } from '../modules/service/service.entity';

@Injectable()
export class PlannedOffHelper {
  service: Service;

  plannedOff: PlannedOff;

  plannedOffs: PlannedOff[];

  plannedOffsBetweenDates: PlannedOff[];

  forPlannedOff(plannedOff: PlannedOff): this {
    this.plannedOff = plannedOff;

    return this;
  }

  forService(service: Service): this {
    this.service = service;

    this.plannedOffs = service.plannedOffs;

    return this;
  }

  whereBetween(startDate: moment.Moment, endDate: moment.Moment): this {
    this.plannedOffsBetweenDates = this.plannedOffs.filter(
      (plannedOff: PlannedOff) => {
        const plannedOffHelper = this.forPlannedOff(plannedOff);

        return (
          plannedOffHelper.startDateIsEqual(startDate) ||
          plannedOffHelper.endDateIsEqual(endDate) ||
          (plannedOffHelper.startDateIsBefore(startDate) &&
            plannedOffHelper.endDateIsAfter(startDate)) ||
          (plannedOffHelper.startDateIsBefore(endDate) &&
            plannedOffHelper.endDateIsAfter(endDate)) ||
          (plannedOffHelper.startDateIsAfter(startDate) &&
            plannedOffHelper.endDateIsBefore(endDate))
        );
      },
    );

    return this;
  }

  exists(): boolean {
    return !!this.plannedOffsBetweenDates.length;
  }

  startDateIsEqual(date: moment.Moment): boolean {
    return date.isSame(this.plannedOff.startDate);
  }

  startDateIsBefore(date: moment.Moment): boolean {
    return moment(this.plannedOff.startDate).isBefore(date);
  }

  startDateIsAfter(date: moment.Moment): boolean {
    return moment(this.plannedOff.startDate).isAfter(date);
  }

  endDateIsEqual(date: moment.Moment): boolean {
    return date.isSame(this.plannedOff.endDate);
  }

  endDateIsBefore(date: moment.Moment): boolean {
    return moment(this.plannedOff.endDate).isBefore(date);
  }

  endDateIsAfter(date: moment.Moment): boolean {
    return moment(this.plannedOff.endDate).isAfter(date);
  }
}
