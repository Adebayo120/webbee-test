import { Module } from '@nestjs/common';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { ValidatorsModule } from './../validators/validators.module';
import { HelpersModule } from './../helpers/helpers.module';
import { FactoriesModule } from './../factories/factories.module';
import { Service } from './../service/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Service]),
    HelpersModule,
    ValidatorsModule,
    FactoriesModule,
  ],
  providers: [AppointmentResolver, AppointmentService],
})
export class AppointmentModule {}
