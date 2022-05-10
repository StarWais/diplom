import { ApiProperty } from '@nestjs/swagger';
import { CourseReview } from '@prisma/client';
import { Expose } from 'class-transformer';

import { BaseAbstractReviewDto } from '../../../../common/dto/response/base-abstract-review.dto';

export class CourseReviewDto
  extends BaseAbstractReviewDto
  implements CourseReview
{
  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'ID курса',
    example: 1,
  })
  readonly courseId: number;

  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'ID студента',
    example: 2,
  })
  readonly studentId: number;

  constructor(partial: Partial<CourseReview>) {
    super(partial);
    Object.assign(this, partial);
  }
}
