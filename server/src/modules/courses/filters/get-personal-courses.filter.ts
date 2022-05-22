import { ApiProperty } from '@nestjs/swagger';

import { GetCoursesFilter } from './get-courses.filter';

export class GetPersonalCoursesFilter extends GetCoursesFilter {
  @ApiProperty({
    description: 'Завершен ли курс',
    required: false,
    type: 'boolean',
    example: false,
  })
  readonly finished?: boolean;
}
