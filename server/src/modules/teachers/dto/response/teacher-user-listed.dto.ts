import { BasicUserDto } from '../../../users/dto/response';

export class TeacherUserListedDto extends BasicUserDto {
  constructor(partial: Partial<TeacherUserListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
