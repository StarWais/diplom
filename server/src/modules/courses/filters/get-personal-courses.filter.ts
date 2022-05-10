import { GetCoursesFilter } from './get-courses.filter';
import { ApiProperty } from '@nestjs/swagger';

export class GetPersonalCoursesFilter extends GetCoursesFilter {
  @ApiProperty({
    description: 'Завершен ли курс',
    required: false,
    type: 'boolean',
    example: false,
  })
  readonly finished?: boolean;
}
