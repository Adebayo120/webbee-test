import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { BookAppointmentInput } from './dtos/book-appointment.input';
import { SlotValidatorsPipe } from '../validators/pipes/slot-validators/slot-validators.pipe';

@Resolver((of) => Appointment)
export class AppointmentResolver {
  constructor(private appointmentService: AppointmentService) {}

  @Mutation((returns) => [Appointment!]!)
  bookAppointment(
    @Args('bookAppointmentInput', SlotValidatorsPipe)
    bookAppointmentInput: BookAppointmentInput,
  ): Promise<Appointment[]> {
    return this.appointmentService.bookAppointment(
      bookAppointmentInput.profiles,
    );
  }
}
