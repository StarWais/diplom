import { Student } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class StudentDto extends BaseAbstractDto implements Student {
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
}
