import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { BookAppointmentInput } from './dtos/book-appointment.input';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SlotHelper } from 'src/helpers/slot.helper';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private slotHelper: SlotHelper,
  ) {}

  async bookAppointment(
    bookAppointmentInput: BookAppointmentInput,
  ): Promise<Appointment[]> {
    const appointments = bookAppointmentInput.profiles.map((profile) => {
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
