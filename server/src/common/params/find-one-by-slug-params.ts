import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneBySlugParams {
  @ApiProperty({
    example: 1,
    required: true,
    type: 'string',
    description: 'Slug ресурса',
  })
  @IsString()
  slug: string;
}
