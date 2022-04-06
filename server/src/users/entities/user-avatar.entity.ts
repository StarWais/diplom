import { ApiProperty } from '@nestjs/swagger';
import { Avatar } from '@prisma/client';

import { CreatedUpdatedEntity, FileEntity } from '../../common/entities';

export class UserAvatarEntity extends CreatedUpdatedEntity implements Avatar {
  @ApiProperty({
    type: 'integer',
    example: 1,
  })
  id: number;
  @ApiProperty({
    type: 'integer',
    example: 2,
  })
  userId: number;
  @ApiProperty({
    type: 'integer',
    example: 3,
  })
  fileId: number;

  @ApiProperty({
    type: FileEntity,
  })
  file: FileEntity;

  constructor(data: Partial<UserAvatarEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
