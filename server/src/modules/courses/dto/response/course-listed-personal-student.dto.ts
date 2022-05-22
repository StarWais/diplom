import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { differenceInMilliseconds } from 'date-fns';

import { CourseListedPersonalBaseDto } from './course-listed-personal-base.dto';

export class CourseListedPersonalStudentDto extends CourseListedPersonalBaseDto {
  @Expose()
  @ApiProperty({
    description: 'Прогресс обучения',
    type: 'string',
    example: '50%',
  })
  get progress(): string {
    const { finishDate, startDate } = this;
    const betweenTodayAndFinishDate = differenceInMilliseconds(
      new Date(),
      finishDate,
    );
    const betweenFinishDateAndStartDate = differenceInMilliseconds(
      finishDate,
      startDate,
    );
    const progress = Math.round(
      (betweenTodayAndFinishDate / betweenFinishDateAndStartDate) * 100,
    );
    return `${progress}%`;
  }

  constructor(partial: Partial<CourseListedPersonalStudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
