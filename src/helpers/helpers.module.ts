import { Module } from '@nestjs/common';
import { SlotHelper } from './slot.helper';
import { ServiceHelper } from './service.helper';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { PlannedOffHelper } from './planned-off-helper';
import { BookableCalenderHelper } from './bookable-calender.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [
    SlotHelper,
    ServiceHelper,
    ConfiguredBreakHelper,
    PlannedOffHelper,
    BookableCalenderHelper,
  ],
  exports: [
    SlotHelper,
    ServiceHelper,
    ConfiguredBreakHelper,
    PlannedOffHelper,
    BookableCalenderHelper,
  ],
})
export class HelpersModule {}
