import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from './base-abstract.dto';
import { Expose } from 'class-transformer';

export class TagDto extends BaseAbstractDto {
  @Expose()
  @ApiProperty({
    description: 'Название тэга',
    example: 'математика',
  })
  readonly name: string;

  constructor(partial: Partial<TagDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
