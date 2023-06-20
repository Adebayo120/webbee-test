import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotResolver } from './slot.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/service/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [SlotService, SlotResolver],
})
export class SlotModule {}
