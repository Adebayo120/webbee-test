import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SlotHelper } from './../helpers/slot.helper';
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
      const appointment = new Appointment();
      appointment.firstName = profile.firstName;
      appointment.lastName = profile.lastName;
      appointment.email = profile.email;
      appointment.service = this.slotHelper.getService();
      appointment.startDate = this.slotHelper.getStartDate().format();
      appointment.endDate = this.slotHelper.getEndDate().format();

      return appointment;
    });

    this.appointmentRepository.insert(appointments);

    return appointments;
  }
}
