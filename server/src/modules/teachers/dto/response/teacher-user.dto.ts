import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

import { UserDto } from '../../../users/dto/response';
import { TeacherDto } from './teacher.dto';

export class TeacherUserDto extends IntersectionType(
  TeacherDto,
  PickType(UserDto, [
    'email',
    'firstName',
    'lastName',
    'middleName',
    'fullName',
    'avatarLink',
    'email',
    'phone',
  ] as const),
) {
  @Exclude()
  readonly user: User;

  constructor(partial: Partial<TeacherUserDto>) {
    super(partial);
    Object.assign(this, {
      ...partial,
      ...partial.user,
    });
  }

  @Expose()
  @ApiProperty({
    description: 'Количество обученных студентов',
    type: 'integer',
    example: 10,
  })
  get studentsTaughtCount(): number {
    return this.studentsTaught.length;
  }
}
