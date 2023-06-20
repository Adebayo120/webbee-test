import { Injectable } from '@nestjs/common';
import { ConfiguredBreak } from './configured-break.entity';
import { Service } from 'src/service/service.entity';

@Injectable()
export class ConfiguredBreakHelper {
  private breaks: ConfiguredBreak[];

  forService(service: Service): this {
    this.breaks = service.configuredBreaks;

    return this;
  }
}
