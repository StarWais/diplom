import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class FindByOlympicsIdParams {
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'ID олимпиады',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly olympicsId: number;
}
