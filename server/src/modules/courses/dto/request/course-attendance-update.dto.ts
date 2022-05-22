import { PickType } from '@nestjs/swagger';

import { CourseAttendanceCreateDto } from './course-attendance-create.dto';

export class CourseAttendanceUpdateDto extends PickType(
  CourseAttendanceCreateDto,
  ['status'] as const,
) {}
