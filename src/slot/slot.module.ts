import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotResolver } from './slot.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { Appointment } from 'src/appointment/appointment.entity';
import { HelpersModule } from 'src/helpers/helpers.module';
import { ValidatorsModule } from 'src/validators/validators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Appointment]),
    HelpersModule,
    ValidatorsModule,
  ],
  providers: [SlotService, SlotResolver],
})
export class SlotModule {}
