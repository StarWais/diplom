import { OlympiadReview } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractReviewDto } from '@common/dto/response/base-abstract-review.dto';
import { BasicUserDto } from '@users/dto/response';
import { StudentIncludesUser } from '@students/interfaces';

export class OlympicReviewDto
  extends BaseAbstractReviewDto
  implements OlympiadReview
{
  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'ID олимпиады',
    example: 2,
  })
  readonly olympiadId: number;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'ID студента',
    example: 1,
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

  constructor(partial: Partial<OlympicReviewDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
