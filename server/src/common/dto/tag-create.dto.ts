import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class TagCreateDto {
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    example: 'математика',
  })
  readonly name: string;
}
