import { PublishingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractDto } from './base-abstract.dto';
import { BasicUserDto } from '../../../modules/users/dto/response';
import { StudentIncludesUser } from '../../../modules/students/interfaces';

export class BaseAbstractReviewDto extends BaseAbstractDto {
  @Expose()
  @ApiProperty({
    description: 'Рейтинг',
    type: 'integer',
    example: 4.3,
  })
  readonly rating: number;

  @Expose()
  @ApiProperty({
    description: 'Статус публикации отзыва',
    enum: PublishingStatus,
    example: PublishingStatus.PUBLISHED,
  })
  readonly status: PublishingStatus;

  @Expose()
  @ApiProperty({
    description: 'Текст отзыва',
    type: 'string',
    example: 'Отличный сервис!',
  })
  readonly text: string;

  @Expose()
  @ApiProperty({
    description: 'Автор отзыва',
    type: () => BasicUserDto,
  })
  @Type(() => BasicUserDto)
  readonly author: BasicUserDto;

  @Exclude()
  readonly student: StudentIncludesUser;

  constructor(partial: Partial<BaseAbstractReviewDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
