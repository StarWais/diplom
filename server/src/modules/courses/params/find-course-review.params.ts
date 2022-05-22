import { IntersectionType } from '@nestjs/swagger';
import { FindByCourseIdParams } from './find-by-courseId.params';
import { FindOneByIDParams } from '@common/params';

export class FindCourseReviewParams extends IntersectionType(
  FindByCourseIdParams,
  FindOneByIDParams,
) {}
