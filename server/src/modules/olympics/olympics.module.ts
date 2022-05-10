import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { OlympicsController } from './controllers';
import { OlympicsService } from './services';
import { FormDataConfigService } from '../../config/services';

@Module({
  controllers: [OlympicsController],
  providers: [OlympicsService],
  exports: [],
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormDataConfigService,
    }),
  ],
})
export class OlympicsModule {}
