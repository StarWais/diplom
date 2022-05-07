import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class TagCreateDto {
  @MaxLength(50)
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    example: 'математика',
    description: 'Название тега',
  })
  readonly name: string;
}
