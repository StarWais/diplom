import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { OlympicsController } from './controllers';
import { OlympicsService } from './services';
import { FormdataConfigService } from '../../config/services';

@Module({
  controllers: [OlympicsController],
  providers: [OlympicsService],
  exports: [],
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
})
export class OlympicsModule {}
