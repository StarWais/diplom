import { PublishingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CourseReviewUpdateDto {
  @IsNotEmpty()
  @IsEnum(PublishingStatus)
  @ApiProperty({
    enum: PublishingStatus,
    example: PublishingStatus.PUBLISHED,
    description: 'Статус публикации отзыва',
  })
  readonly status: PublishingStatus;
}
