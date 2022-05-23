import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import {
  OlympicsApplicationsController,
  OlympicsController,
  OlympicsReviewsController,
  OlympicsStepAttemptsController,
  OlympicsStepResultsController,
  OlympicsStepsController,
  OlympicsTasksAttemptsController,
  OlympicsTasksController,
  OlympicsTasksVariantsController,
} from './controllers';
import {
  OlympicsApplicationsService,
  OlympicsReviewsService,
  OlympicsService,
  OlympicsStepAttemptsService,
  OlympicsStepResultsService,
  OlympicsStepsService,
  OlympicsTasksAttemptsService,
  OlympicsTasksService,
  OlympicsTasksVariantsService,
} from './services';
import { FormDataConfigService } from '@config/services';

@Module({
  controllers: [
    OlympicsController,
    OlympicsApplicationsController,
    OlympicsTasksController,
    OlympicsReviewsController,
    OlympicsStepAttemptsController,
    OlympicsStepsController,
    OlympicsTasksAttemptsController,
    OlympicsTasksVariantsController,
    OlympicsStepResultsController,
  ],
  providers: [
    OlympicsService,
    OlympicsApplicationsService,
    OlympicsStepsService,
    OlympicsReviewsService,
    OlympicsTasksService,
    OlympicsTasksVariantsService,
    OlympicsTasksAttemptsService,
    OlympicsStepResultsService,
    OlympicsStepAttemptsService,
  ],
  exports: [],
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormDataConfigService,
    }),
  ],
})
export class OlympicsModule {}
