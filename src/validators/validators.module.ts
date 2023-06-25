import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './../service/service.entity';
import { HelpersModule } from './../helpers/helpers.module';
import { ExistsRule } from './rules/exists.rule';
import { SlotvalidatorsPipe } from './pipes/slotvalidators/slotvalidators.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), HelpersModule],
  providers: [
    ...SlotvalidatorsPipe.validators(),
    ExistsRule,
    SlotvalidatorsPipe,
  ],
  exports: [SlotvalidatorsPipe],
})
export class ValidatorsModule {}
