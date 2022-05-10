import { CourseEducationStep } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class CourseEducationStepDto
  extends BaseAbstractDto
  implements CourseEducationStep
{
  @Expose()
  @ApiProperty({
    description: 'ID курса',
    type: 'integer',
    example: 2,
  })
  readonly courseId: number;

  @Expose()
  @ApiProperty({
    description: 'Номер шага',
    type: 'integer',
    example: 1,
  })
  readonly step: number;

  @Expose()
  @ApiProperty({
    description: 'Название шага',
    type: 'string',
    example: 'Проверка знаний',
  })
  readonly title: string;

  @Expose()
  @ApiProperty({
    description: 'Описание шага',
    type: 'string',
    example: 'Это длинное описание шага',
  })
  readonly description: string;

  constructor(partial: Partial<CourseEducationStepDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
