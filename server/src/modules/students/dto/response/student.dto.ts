import { Student } from '@prisma/client';

import { BaseAbstractDto } from '../../../../common/dto/response/base-abstract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto extends BaseAbstractDto implements Student {
  @ApiProperty({
    description: 'ID пользователя',
    example: 1,
    type: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: 'Название учереждения образования пользователя',
    example: 'Гродненская городская Гимназия',
    type: 'string',
    nullable: true,
  })
  educationalInstitution: string | null;

  @ApiProperty({
    description: 'Класс пользователя',
    example: 8,
    type: 'integer',
    nullable: true,
  })
  grade: number | null;

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
