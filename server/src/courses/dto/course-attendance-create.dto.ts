import { AttendanceStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CourseAttendanceCreateDto {
  @ApiProperty({
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  readonly studentId: number;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  readonly status: AttendanceStatus;

  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}
