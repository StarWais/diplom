import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    default: 1,
    required: false,
    description: 'Номер страницы',
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 20,
    required: false,
    default: 20,
    description: 'Количество записей на странице',
  })
  limit?: number;
}
