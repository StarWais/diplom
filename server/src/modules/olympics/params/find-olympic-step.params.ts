import { IntersectionType } from '@nestjs/swagger';

import { FindByOlympicsIdParams } from './find-by-olympics-id.params';
import { FindByOlympicsStepIdParams } from './find-by-olympics-step-id.params';

export class FindOlympicStepParams extends IntersectionType(
  FindByOlympicsStepIdParams,
  FindByOlympicsIdParams,
) {}
