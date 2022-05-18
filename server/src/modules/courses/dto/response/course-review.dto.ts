import { ApiProperty } from '@nestjs/swagger';
import { CourseReview } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractReviewDto } from '../../../../common/dto/response/base-abstract-review.dto';
import { BasicUserDto } from '../../../users/dto/response';
import { StudentIncludesUser } from '../../../students/interfaces';

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

  @Exclude()
  readonly student: StudentIncludesUser;

  @Expose()
  @ApiProperty({
    description: 'Автор отзыва',
    type: () => BasicUserDto,
  })
  @Type(() => BasicUserDto)
  get author(): BasicUserDto {
    return new BasicUserDto(this.student.user);
  }

  constructor(partial: Partial<CourseReview>) {
    super(partial);
    Object.assign(this, partial);
  }
}
