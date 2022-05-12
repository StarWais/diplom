import { PickType } from '@nestjs/swagger';
import { TeacherUserDto } from './teacher-user.dto';

export class TeacherUserListedDto extends PickType(TeacherUserDto, [
  'firstName',
  'lastName',
  'middleName',
  'avatarLink',
  'id',
]) {
  constructor(partial: Partial<TeacherUserListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
