import { ApplicationStatus, CourseApplication } from '@prisma/client';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractDto } from '@common/dto/response';
import { CourseDto } from './course.dto';
import { BasicUserDto } from '@users/dto/response';
import { StudentIncludesUser } from '@students/interfaces';

export class CourseApplicationDto
  extends BaseAbstractDto
  implements CourseApplication
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
    description: 'ID студента',
    type: 'integer',
    example: 2,
    nullable: true,
  })
  readonly studentId: number | null;

  @Expose()
  @ApiProperty({
    description: 'Имя заявителя',
    type: 'string',
    example: 'Иван Иванович Иванов',
  })
  readonly applicantName: string;

  @Expose()
  @ApiProperty({
    description: 'Телефон заявителя',
    type: 'string',
    example: '+375291234567',
  })
  readonly applicantPhone: string;

  @Expose()
  @ApiProperty({
    type: () => PickType(CourseDto, ['id', 'name'] as const),
    description: 'Информация о курсе',
  })
  @Type(() => PickType(CourseDto, ['id', 'name'] as const))
  readonly course: Pick<CourseDto, 'name' | 'id'>;

  @Expose()
  @ApiProperty({
    description: 'Статус заявки',
    type: 'string',
    enum: ApplicationStatus,
    example: ApplicationStatus.CREATED,
  })
  readonly status: ApplicationStatus;

  @Exclude()
  private readonly student: StudentIncludesUser | null;

  @Expose()
  @ApiProperty({
    type: () => BasicUserDto,
    description: 'Информация о студенте',
    nullable: true,
  })
  @Type(() => BasicUserDto)
  get user(): BasicUserDto | null {
    return (this.student?.user as unknown as BasicUserDto) || null;
  }

  constructor(partial: Partial<CourseApplicationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
