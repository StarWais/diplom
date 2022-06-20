import { GetOlympicsFilter } from '@olympics/filters/get-olympics.filter';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetMyOlympicsFilter extends GetOlympicsFilter {
  @ApiProperty({
    description: 'Этап олимпиады',
    type: 'integer',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly step?: number;
}
