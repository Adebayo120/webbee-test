import { Module } from '@nestjs/common';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { ValidatorsModule } from 'src/validators/validators.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ValidatorsModule],
  providers: [AppointmentResolver, AppointmentService],
})
export class AppointmentModule {}
