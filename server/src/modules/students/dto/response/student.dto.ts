import { Student } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { Expose } from 'class-transformer';

export class StudentDto extends BaseAbstractDto implements Student {
  @Expose()
  @ApiProperty({
    description: 'Название учереждения образования пользователя',
    example: 'Гродненская городская Гимназия',
    type: 'string',
    nullable: true,
  })
  educationalInstitution: string | null;

  @Expose()
  @ApiProperty({
    description: 'Класс пользователя',
    example: 8,
    type: 'integer',
    nullable: true,
  })
  grade: number | null;

  @Expose()
  @ApiProperty({
    description: 'Фамилии препоавателей пользователя',
    type: 'string',
    nullable: true,
  })
  teachers: string | null;

  constructor(partial: Partial<StudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
