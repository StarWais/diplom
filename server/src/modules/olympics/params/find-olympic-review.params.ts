import { IntersectionType } from '@nestjs/swagger';

import { FindByOlympicsIdParams } from './find-by-olympicsId.params';
import { FindOneByIDParams } from '@common/params';

export class FindOlympicReviewParams extends IntersectionType(
  FindOneByIDParams,
  FindByOlympicsIdParams,
) {}
