import { PickType } from '@nestjs/swagger';
import { CourseAttendanceCreateDto } from '.';

export class CourseAttendanceUpdateDto extends PickType(
  CourseAttendanceCreateDto,
  ['status'] as const,
) {}
