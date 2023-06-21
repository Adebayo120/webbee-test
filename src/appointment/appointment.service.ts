import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { BookAppointmentInput } from './dtos/book-appointment.input';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async bookAppointment(
    bookAppointmentInput: BookAppointmentInput,
  ): Promise<Appointment> {
    const appointment = new Appointment();
    appointment.id = 234;

    return appointment;
  }
}
