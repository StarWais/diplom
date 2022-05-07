import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneByIDParams {
  @ApiProperty({
    example: 1,
    required: true,
    type: 'number',
    description: 'ID ресурса',
  })
  @IsInt()
  @IsPositive()
  readonly id: number;
}
