import { PickType } from '@nestjs/swagger';
import { CourseAttendanceCreateDto } from './index';

export class CourseAttendanceUpdateDto extends PickType(
  CourseAttendanceCreateDto,
  ['status'] as const,
) {}
