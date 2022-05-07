import { BaseAbstractDto } from './base-abstract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TagDto extends BaseAbstractDto {
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
