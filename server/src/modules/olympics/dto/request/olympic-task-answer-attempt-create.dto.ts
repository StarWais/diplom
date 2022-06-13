import { IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OlympicTaskAnswerAttemptCreateDto {
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ApiProperty({
    description: 'Варианты ответов',
    example: 1,
    type: 'integer',
    required: true,
    isArray: true,
  })
  readonly variants: Array<number>;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Идентификатор задания',
    example: 1,
    type: 'integer',
    required: true,
  })
  readonly taskId: number;
}
