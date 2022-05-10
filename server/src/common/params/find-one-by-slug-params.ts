import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneBySlugParams {
  @ApiProperty({
    example: 'this-is-a-slug',
    required: true,
    type: 'string',
    description: 'Slug ресурса',
  })
  @IsString()
  slug: string;
}
