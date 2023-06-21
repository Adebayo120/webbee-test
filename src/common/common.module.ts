import { Module } from '@nestjs/common';
import { SlotIsAfterNowRule } from './validation-rules/slot-is-after-now.rule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { Service } from 'src/service/service.entity';
import { SlotIsAvailableRule } from './validation-rules/slot-is-available.rule';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Service])],
  providers: [SlotIsAfterNowRule, SlotIsAvailableRule],
})
export class CommonModule {}
