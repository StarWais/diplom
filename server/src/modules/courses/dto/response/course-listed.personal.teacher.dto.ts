import { CourseListedPersonalBaseDto } from './course-listed-personal-base.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { differenceInMilliseconds } from 'date-fns';

export class CourseListedPersonalTeacherDto extends CourseListedPersonalBaseDto {
  constructor(partial: Partial<CourseListedPersonalTeacherDto>) {
    super(partial);
    Object.assign(this, partial);
  }

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
}
