import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { BusinessAdministratorModule } from './business_administrator/business_administrator.module';
import { dataSourceOptions } from 'database/data-source';
import { ServiceModule } from './service/service.module';
import { BookableCalenderModule } from './bookable_calender/bookable_calender.module';
import { ConfiguredBreakModule } from './configured_break/configured_break.module';
import { PlannedOffModule } from './planned_off/planned_off.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    BusinessAdministratorModule,
    ServiceModule,
    BookableCalenderModule,
    ConfiguredBreakModule,
    PlannedOffModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
