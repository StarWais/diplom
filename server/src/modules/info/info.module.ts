import { Module } from '@nestjs/common';

import { InfoService } from './services';
import { InfoController } from './controllers';

@Module({
  providers: [InfoService],
  controllers: [InfoController],
})
export class InfoModule {}
