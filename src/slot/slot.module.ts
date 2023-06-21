import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotResolver } from './slot.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { Appointment } from 'src/appointment/appointment.entity';
import { SlotHelper } from './slot.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Appointment])],
  providers: [SlotService, SlotResolver, SlotHelper],
})
export class SlotModule {}
