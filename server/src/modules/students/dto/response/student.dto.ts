import { Student } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '@common/dto/response';

export class StudentDto extends BaseAbstractDto implements Student {
  @Expose()
  @ApiProperty({
    description: 'Название учереждения образования пользователя',
    example: 'Гродненская городская Гимназия',
    type: 'string',
    nullable: true,
  })
  readonly educationalInstitution: string | null;

  @Expose()
  @ApiProperty({
    description: 'Класс пользователя',
    example: 8,
    type: 'integer',
    nullable: true,
  })
  readonly grade: number | null;

  @Expose()
  @ApiProperty({
    description: 'Фамилии препоавателей пользователя',
    type: 'string',
    nullable: true,
  })
  readonly teachers: string | null;

  constructor(partial: Partial<StudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
