import { Module } from '@nestjs/common';

import { FaqController } from './controllers';
import { FaqService } from './services';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
