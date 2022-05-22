import { AttendanceStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CourseAttendanceCreateDto {
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'Идентификатор студента',
  })
  @IsInt()
  @IsPositive()
  readonly studentId: number;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
    description: 'Статус посещения',
  })
  readonly status: AttendanceStatus;

  @ApiProperty({
    description: 'Дата посещения',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}
