import { CourseDto } from './course.dto';
import { PickType } from '@nestjs/swagger';

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
