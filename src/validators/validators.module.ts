import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SlotIsValidRule } from './rules/slot-is-valid.rule';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), HelpersModule],
  providers: [...SlotIsValidRule.validators(), SlotIsValidRule],
})
export class ValidatorsModule {}
