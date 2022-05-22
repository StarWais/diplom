import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserDto } from './user.dto';

export class BasicUserDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
  'middleName',
  'avatarLink',
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
  constructor(partial: Partial<BasicUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
