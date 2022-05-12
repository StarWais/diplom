import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsPositive } from 'class-validator';

export class OlympicApplicationCreateDto {
  @IsArray()
  @IsInt({
    each: true,
  })
  @IsPositive({
    each: true,
  })
  @ApiProperty({
    type: 'integer',
    isArray: true,
  })
  readonly stepIds: Array<number>;
}
