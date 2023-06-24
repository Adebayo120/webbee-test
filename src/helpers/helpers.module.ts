import { Module } from '@nestjs/common';
import { SlotHelper } from './slot.helper';
import { ServiceHelper } from './service.helper';
import { ConfiguredBreakHelper } from './configured-break.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './../appointment/appointment.entity';
import { PlannedOffHelper } from './planned-off.helper';
import { BookableCalenderHelper } from './bookable-calender.helper';
import { FactoriesModule } from './../factories/factories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), FactoriesModule],
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
