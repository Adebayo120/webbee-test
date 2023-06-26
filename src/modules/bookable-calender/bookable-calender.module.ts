import { Module } from '@nestjs/common';
import { BookableCalenderHelper } from '../../helpers/bookable-calender.helper';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  providers: [BookableCalenderHelper],
  exports: [BookableCalenderHelper],
  imports: [HelpersModule],
})
export class BookableCalenderModule {}
