import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SlotHelper } from '../../helpers/slot.helper';
import { ProfileInput } from './dtos/profile.input';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private slotHelper: SlotHelper,
  ) {}

  async bookAppointment(profiles: ProfileInput[]): Promise<Appointment[]> {
    const appointments = profiles.map((profile) => {
      return this.appointmentRepository.create({
        ...profile,
        service: this.slotHelper.getService(),
        startDate: this.slotHelper.getStartDate().format(),
        endDate: this.slotHelper.getEndDate().format(),
      });
    });

    await this.appointmentRepository.insert(appointments);

    return appointments;
  }
}
