import { PublishingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from './base-abstract.dto';

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

  constructor(partial: Partial<BaseAbstractReviewDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
