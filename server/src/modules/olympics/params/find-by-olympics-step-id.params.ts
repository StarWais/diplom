import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class FindByOlympicsStepIdParams {
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'ID этапа олимпиады',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly stepId: number;
}
