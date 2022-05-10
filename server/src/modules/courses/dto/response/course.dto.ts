import { Course, Teacher, User } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { BasicUserNameDto } from '../../../users/dto/response';
import { CourseModuleDto } from './course-module.dto';
import { CourseEducationStepDto } from './course-education-step.dto';

interface TeacherIncludesUser extends Teacher {
  user: User;
}

export class CourseDto extends BaseAbstractDto implements Course {
  @Expose()
  @ApiProperty({
    description: 'ID преподавателя',
    type: 'integer',
    example: 1,
  })
  readonly teacherId: number;

  @Expose()
  @ApiProperty({
    description: 'Название курса',
    type: 'string',
    example: 'Программирование на Java',
  })
  readonly name: string;

  @Expose()
  @ApiProperty({
    description: 'Вместимость курса',
    type: 'integer',
    example: 10,
  })
  readonly capacity: number;

  @Expose()
  @ApiProperty({
    description: 'Рейтинг курса',
    type: 'integer',
    example: 4.5,
  })
  readonly rating: number;

  @Expose()
  @ApiProperty({
    description: 'Класс курса',
    type: 'integer',
    example: 1,
  })
  readonly grade: number;

  @Expose()
  @ApiProperty({
    description: 'Для кого курс',
    type: 'string',
    isArray: true,
    example: ['Для новичков', 'Для продвинутых'],
  })
  readonly toWhom: string[];

  @Expose()
  @ApiProperty({
    description: 'Возможности курса',
    type: 'string',
    isArray: true,
    example: ['Возможность 1', 'Возможность 2'],
  })
  readonly possibilities: string[];

  @Expose()
  @ApiProperty({
    description: 'Дата начала курса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly startDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на материалы курса',
    type: 'string',
    example: 'https:/example.com/course-materials.rar',
  })
  readonly materialsLink: string;

  @Expose()
  @ApiProperty({
    description: 'Количество материалов курса',
    type: 'integer',
    example: 10,
  })
  readonly materialsCount: number;

  @Expose()
  @ApiProperty({
    description: 'Модули курса',
    type: CourseModuleDto,
    isArray: true,
  })
  @Type(() => CourseModuleDto)
  readonly modules: Array<CourseModuleDto>;

  @Expose()
  @ApiProperty({
    description: 'Шаги курса',
    type: CourseEducationStepDto,
    isArray: true,
  })
  @Type(() => CourseModuleDto)
  readonly steps: Array<CourseEducationStepDto>;
  @Expose()
  @ApiProperty({
    description: 'Цена курса',
    type: 'integer',
    example: 150,
  })
  readonly price: number;
  @Expose()
  @ApiProperty({
    description: 'Ссылка на картинку курса',
    type: 'image',
    example: 'https://example.com/course-image.jpg',
  })
  readonly imageLink: string;
  @Expose()
  @ApiProperty({
    description: 'Номер ерип',
    type: 'integer',
    example: '7589098349AEJK8U89',
  })
  readonly eripNumber: string;
  @Expose()
  @ApiProperty({
    description: 'Дата окончания курса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly finishDate: Date;
  @Expose()
  @ApiProperty({
    description: 'Завершен ли курс',
    type: 'boolean',
    example: false,
  })
  readonly finished: boolean;
  @Expose()
  @ApiProperty({
    description: 'Доступно мест',
    type: 'integer',
    example: 10,
  })
  readonly placesAvailable: number;
  @Exclude()
  readonly teacher: TeacherIncludesUser;
  @Expose()
  @ApiProperty({
    type: BasicUserNameDto,
    description: 'Информация о преподавателе',
  })
  @Type(() => BasicUserNameDto)
  readonly teacherInfo: BasicUserNameDto;

  constructor(partial: Partial<CourseDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty({
    description: 'Количество модулей курса',
    type: 'integer',
    example: 10,
  })
  get modulesCount(): number {
    return this.modules.length;
  }
}
