import { Student, Teacher } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { CourseListedDto } from '../../../courses/dto/response';

export class TeacherDto extends BaseAbstractDto implements Teacher {
  @Expose()
  @ApiProperty({
    description: 'Рейтинг преподавателя',
    type: 'integer',
    example: 4.5,
  })
  readonly rating: number;

  @Expose()
  @ApiProperty({
    description: 'О преподавателе',
    type: 'string',
    example: 'Пример информации о преподавателе',
    nullable: true,
  })
  readonly about: string | null;

  @Expose()
  @ApiProperty({
    description: 'Специализации преподавателя',
    type: 'string',
    isArray: true,
    example: ['программирование', 'математика'],
  })
  readonly specialisations: string[];

  @Expose()
  @ApiProperty({
    description: 'Ссылка на Telegram преподавателя',
    type: 'string',
    example: 'https://t.me/teacher_name',
    nullable: true,
  })
  readonly telegramLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на Whatsapp преподавателя',
    type: 'string',
    example: 'https://was.me/teacher_name',
    nullable: true,
  })
  readonly whatsappLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на Viber преподавателя',
    type: 'string',
    example: 'https://viber.me/teacher_name',
    nullable: true,
  })
  readonly viberLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на Вконтакте преподавателя',
    type: 'string',
    example: 'https://vk.com/teacher_name',
    nullable: true,
  })
  readonly vkLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на Facebook преподавателя',
    type: 'string',
    example: 'https://fb.me/teacher_name',
    nullable: true,
  })
  readonly skypeLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Курсы, которые преподает преподаватель',
    type: CourseListedDto,
    isArray: true,
  })
  @Expose()
  @Type(() => CourseListedDto)
  readonly courses: Array<CourseListedDto>;

  @Exclude()
  readonly studentsTaught: Array<Student>;

  constructor(partial: Partial<TeacherDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
