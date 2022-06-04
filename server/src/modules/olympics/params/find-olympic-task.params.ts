import { IntersectionType } from '@nestjs/swagger';

import { FindOlympicStepParams } from './find-olympic-step.params';
import { FindByOlympicsTaskIdParams } from './find-by-olympics-task-id.params';

export class FindOlympicTaskParams extends IntersectionType(
  FindOlympicStepParams,
  FindByOlympicsTaskIdParams,
) {}
