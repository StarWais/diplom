import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class FindByOlympicsTaskIdParams {
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'ID задания',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly taskId: number;
}
