import { ApiProperty } from '@nestjs/swagger';

export class FindByCourseIdParams {
  @ApiProperty({
    description: 'ID курса',
    type: 'integer',
    example: 1,
  })
  readonly courseId: number;
}
