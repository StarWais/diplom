import { CreatedUpdatedEntity } from '.';
import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class FileEntity extends CreatedUpdatedEntity implements File {
  @ApiProperty({
    type: 'integer',
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'example.jpg',
  })
  name: string;
  @ApiProperty({
    example: 'https://example.com/uploads/avatars/example.jpg',
  })
  path: string;
  @ApiProperty({
    type: 'integer',
    example: 24534423,
  })
  size: number;
  @ApiProperty({
    example: 'image/png',
  })
  format: string;

  constructor(data: Partial<FileEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
