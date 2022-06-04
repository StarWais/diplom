import { IntersectionType } from '@nestjs/swagger';

import { FindByOlympicsIdParams } from './find-by-olympics-id.params';
import { FindOneByIDParams } from '@common/params';

export class FindOlympicReviewParams extends IntersectionType(
  FindOneByIDParams,
  FindByOlympicsIdParams,
) {}
