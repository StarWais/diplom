import { IsEnum, IsNotEmpty } from 'class-validator';
import { PublishingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewUpdateDto {
  @IsNotEmpty()
  @IsEnum(PublishingStatus)
  @ApiProperty({
    enum: PublishingStatus,
    example: PublishingStatus.PUBLISHED,
    description: 'Статус публикации отзыва',
  })
  readonly status: PublishingStatus;
}
