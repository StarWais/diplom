import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class BasicUserDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
  'middleName',
  'fullName',
  'avatarLink',
] as const) {
  constructor(partial: Partial<BasicUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
