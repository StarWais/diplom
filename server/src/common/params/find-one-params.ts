import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @ApiProperty({
    example: 1,
    required: true,
    type: 'number',
    description: 'ID ресурса',
  })
  @IsNumber()
  id: number;
}
