import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotResolver } from './slot.resolver';

@Module({
  providers: [SlotService, SlotResolver]
})
export class SlotModule {}
