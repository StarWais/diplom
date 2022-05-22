import { IntersectionType } from '@nestjs/swagger';

import { FindOneByIDParams } from '@common/params';
import { FindByOlympicsIdParams } from './find-by-olympicsId.params';

export class FindOlympicApplicationParams extends IntersectionType(
  FindOneByIDParams,
  FindByOlympicsIdParams,
) {}
