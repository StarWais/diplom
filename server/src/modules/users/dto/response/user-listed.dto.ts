import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserDto } from './user.dto';

export class UserListedDto extends PickType(UserDto, [
  'id',
  'email',
  'firstName',
  'lastName',
  'middleName',
  'role',
] as const) {
  @Expose()
  @ApiProperty({
    description: 'Полное ФИО пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
