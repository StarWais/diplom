import { IntersectionType } from '@nestjs/swagger';

import { FindOlympicTaskParams } from './find-olympic-task.params';
import { FindOneByIDParams } from '@common/params';

export class FindOlympicTaskVariantParams extends IntersectionType(
  FindOlympicTaskParams,
  FindOneByIDParams,
) {}
