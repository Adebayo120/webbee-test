import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { BookAppointmentInput } from './dtos/book-appointment.input';
import { SlotvalidatorsPipe } from './../validators/pipes/slotvalidators/slotvalidators.pipe';

@Resolver((of) => Appointment)
export class AppointmentResolver {
  constructor(private appointmentService: AppointmentService) {}

  @Mutation((returns) => [Appointment!]!)
  bookAppointment(
    @Args('bookAppointmentInput', SlotvalidatorsPipe)
    bookAppointmentInput: BookAppointmentInput,
  ): Promise<Appointment[]> {
    return this.appointmentService.bookAppointment(
      bookAppointmentInput.profiles,
    );
  }
}
