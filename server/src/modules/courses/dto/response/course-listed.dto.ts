import { ApiProperty, PickType } from '@nestjs/swagger';
import { differenceInCalendarWeeks } from 'date-fns';
import { Expose } from 'class-transformer';

import { CourseDto } from './course.dto';

export class CourseListedDto extends PickType(CourseDto, [
  'id',
  'name',
  'imageLink',
  'startDate',
  'finishDate',
  'grade',
] as const) {
  @Expose()
  @ApiProperty({
    description: 'Длительность курса',
    type: 'string',
    example: '3 недели',
  })
  get length(): string {
    const diff = differenceInCalendarWeeks(this.startDate, this.finishDate);
    return `${Math.round(diff)} недели`;
  }

  constructor(partial: Partial<CourseListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
