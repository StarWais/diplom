import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { CourseApplicationCreateDto } from './course-application-create.dto';

export class CourseApplicationUpdateDto extends PartialType(
  CourseApplicationCreateDto,
) {
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.PENDING,
    required: false,
    description: 'Статус заявки',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  readonly status?: ApplicationStatus;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
    type: 'integer',
    required: false,
    description: 'Идентификатор студента',
  })
  readonly studentId?: number;
}
