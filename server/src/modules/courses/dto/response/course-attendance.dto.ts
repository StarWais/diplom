import { AttendanceStatus, CourseAttendance } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractDto } from '@common/dto/response';
import { BasicUserDto } from '@users/dto/response';
import { StudentIncludesUser } from '@students/interfaces';

export class CourseAttendanceDto
  extends BaseAbstractDto
  implements CourseAttendance
{
  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'ID курса',
    example: 1,
  })
  readonly courseId: number;

  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'ID студента',
    example: 1,
  })
  readonly studentId: number;

  @Exclude()
  readonly student: StudentIncludesUser | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Причина отсутствия',
    example: 'Прогул',
    nullable: true,
  })
  readonly reason: string | null;

  @Expose()
  @ApiProperty({
    enum: AttendanceStatus,
    description: 'Статус посещения',
    example: AttendanceStatus.PRESENT,
  })
  readonly status: AttendanceStatus;

  @Expose()
  @ApiProperty({
    description: 'Дата посещения',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly date: Date;

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

  constructor(partial: Partial<CourseAttendanceDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
