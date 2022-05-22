import { PickType } from '@nestjs/swagger';

import { CourseDto } from './course.dto';

export class CourseListedPersonalBaseDto extends PickType(CourseDto, [
  'id',
  'name',
  'finishDate',
  'startDate',
] as const) {
  constructor(partial: Partial<CourseListedPersonalBaseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
