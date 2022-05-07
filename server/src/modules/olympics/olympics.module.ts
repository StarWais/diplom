import { Module } from '@nestjs/common';

import { OlympicsController } from './controllers';
import { OlympicsService } from './services';

@Module({
  controllers: [OlympicsController],
  providers: [OlympicsService],
  exports: [],
})
export class OlympicsModule {}
