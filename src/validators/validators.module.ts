import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../modules/service/service.entity';
import { HelpersModule } from './../helpers/helpers.module';
import { ExistsRule } from './rules/exists.rule';
import { SlotValidatorsPipe } from './pipes/slot-validators/slot-validators.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), HelpersModule],
  providers: [
    ...SlotValidatorsPipe.validators(),
    ExistsRule,
    SlotValidatorsPipe,
  ],
  exports: [SlotValidatorsPipe],
})
export class ValidatorsModule {}
