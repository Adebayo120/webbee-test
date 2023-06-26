import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAvailableSlotsInput } from '../dtos/get-available-slots.input';
import { Service } from '../../service/service.entity';
import * as moment from 'moment';

@Injectable()
export class GetAvailableSlotsPipe implements PipeTransform {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async transform(
    data: GetAvailableSlotsInput,
  ): Promise<GetAvailableSlotsInput> {
    const service = await this.serviceRepository.findOne({
      where: {
        id: data.serviceId,
      },
      relations: {
        bookableCalenders: true,
        configuredBreaks: true,
        plannedOffs: true,
      },
    });

    const startDate: moment.Moment = moment(data.startDateString).startOf(
      'day',
    );

    const endDate: moment.Moment = moment(data.endDateString).endOf('day');

    return {
      ...data,
      service,
      startDate,
      endDate,
    };
  }
}
