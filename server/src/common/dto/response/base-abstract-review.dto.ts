import { PublishingStatus, Student, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

import { BaseAbstractDto } from './base-abstract.dto';
import { BasicUserDto } from '../../../modules/users/dto/response';

interface StudentIncludesUser extends Student {
  user: User;
}

export abstract class BaseAbstractReviewDto extends BaseAbstractDto {
  @ApiProperty({
    description: 'Рейтинг',
    type: 'integer',
    example: 4.3,
  })
  readonly rating: number;

  @ApiProperty({
    description: 'Статус публикации отзыва',
    enum: PublishingStatus,
    example: PublishingStatus.PUBLISHED,
  })
  readonly status: PublishingStatus;

  @ApiProperty({
    description: 'Текст отзыва',
    type: 'string',
    example: 'Отличный сервис!',
  })
  readonly text: string;

  @ApiProperty({
    description: 'Автор отзыва',
    type: () => BasicUserDto,
  })
  @Type(() => BasicUserDto)
  readonly author: BasicUserDto;

  @Exclude()
  readonly student: StudentIncludesUser;
}
