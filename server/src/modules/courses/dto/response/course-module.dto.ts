import { ApiProperty } from '@nestjs/swagger';
import { CourseModule } from '@prisma/client';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class CourseModuleDto extends BaseAbstractDto implements CourseModule {
  @Expose()
  @ApiProperty({
    description: 'ID курса',
    type: 'integer',
    example: 2,
  })
  readonly courseId: number;

  @Expose()
  @ApiProperty({
    description: 'Название модуля',
    type: 'string',
    example: 'Модуль 1',
  })
  readonly name: string;

  @Expose()
  @ApiProperty({
    description: 'Описание модуля',
    type: 'string',
    example: 'Описание модуля',
  })
  readonly description: string;

  constructor(partial: Partial<CourseModuleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
