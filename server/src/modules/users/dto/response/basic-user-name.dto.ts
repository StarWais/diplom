import { OmitType } from '@nestjs/swagger';

import { BasicUserDto } from './basic-user.dto';

export class BasicUserNameDto extends OmitType(BasicUserDto, ['avatarLink']) {
  constructor(partial: Partial<BasicUserNameDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
