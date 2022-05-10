import { ApiProperty } from '@nestjs/swagger';

export class InfoCountsDto {
  @ApiProperty({
    description: 'Количество преподавателей',
    type: 'integer',
    example: 10,
  })
  readonly teachersCount: number;

  @ApiProperty({
    description: 'Количество учеников',
    type: 'integer',
    example: 10,
  })
  readonly studentsCount: number;

  @ApiProperty({
    description: 'Количество курсов',
    type: 'integer',
    example: 10,
  })
  readonly coursesCount: number;

  @ApiProperty({
    description: 'Количество олимпиад',
    type: 'integer',
    example: 10,
  })
  readonly olympiadsCount: number;

  constructor(partial: Partial<InfoCountsDto>) {
    Object.assign(this, partial);
  }
}
