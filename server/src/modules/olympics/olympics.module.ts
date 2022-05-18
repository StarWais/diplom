import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { OlympicsController } from './controllers';
import {
  OlympicsApplicationsService,
  OlympicsService,
  OlympicsStepsService,
} from './services';
import { FormDataConfigService } from '../../config/services';
import { OlympicsReviewsService } from './services/olympics-reviews.service';

@Module({
  controllers: [OlympicsController],
  providers: [
    OlympicsService,
    OlympicsApplicationsService,
    OlympicsStepsService,
    OlympicsReviewsService,
  ],
  exports: [],
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormDataConfigService,
    }),
  ],
})
export class OlympicsModule {}
