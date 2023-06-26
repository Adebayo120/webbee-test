import { INestApplication } from '@nestjs/common';
import gql from 'graphql-tag';
import request, { SuperTestGraphQL, Variables } from 'supertest-graphql';
import { Slot } from '../../src/modules/slot/object-types/slot.type';
import { GetAvailableSlotsInput } from '../../src/modules/slot/dtos/get-available-slots.input';
import { Appointment } from '../../src/modules/appointment/appointment.entity';
import { BookAppointmentInput } from '../../src/modules/appointment/dtos/book-appointment.input';

export class Request {
  app: INestApplication;
  make(app: INestApplication): this {
    this.app = app;

    return this;
  }

  async availableSlots(
    getAvailableSlotsInput: Partial<GetAvailableSlotsInput>,
  ): Promise<
    SuperTestGraphQL<
      {
        availableSlots: Slot;
      },
      Variables
    >
  > {
    return request<{ availableSlots: Slot }>(this.app.getHttpServer())
      .query(
        gql`
          query GetAvailableSlots(
            $getAvailableSlotsInput: GetAvailableSlotsInput!
          ) {
            availableSlots(getAvailableSlotsInput: $getAvailableSlotsInput) {
              availableDates
              bookableDurationInMinutes
              availableSlots {
                startDate
                bookableAppointmentsCount
              }
            }
          }
        `,
      )
      .variables({ getAvailableSlotsInput });
  }

  async bookAppointment(bookAppointmentInput: BookAppointmentInput): Promise<
    SuperTestGraphQL<
      {
        bookAppointment: [Appointment];
      },
      Variables
    >
  > {
    return request<{ bookAppointment: [Appointment] }>(this.app.getHttpServer())
      .mutate(
        gql`
          mutation BookAppointment(
            $bookAppointmentInput: BookAppointmentInput!
          ) {
            bookAppointment(bookAppointmentInput: $bookAppointmentInput) {
              firstName
              lastName
              email
              startDate
              endDate
            }
          }
        `,
      )
      .variables({
        bookAppointmentInput,
      });
  }
}
