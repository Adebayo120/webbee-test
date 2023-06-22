import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SlotIsValidRule } from './rules/slot-is-valid.rule';
import { SlotIsAfterNowRule } from './rules/slot-is-after-now.rule';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), HelpersModule],
  providers: [SlotIsAfterNowRule, SlotIsValidRule],
  exports: [SlotIsAfterNowRule, SlotIsValidRule],
})
export class ValidatorsModule {}
