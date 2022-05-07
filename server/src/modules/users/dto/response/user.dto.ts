import { Gender, Role, User } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class UserDto extends BaseAbstractDto implements User {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'example@example.com',
    type: 'string',
  })
  readonly email: string;

  @ApiHideProperty()
  @Exclude()
  readonly password: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: Role.TEACHER,
    enum: Role,
  })
  readonly role: Role;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    type: 'string',
  })
  readonly firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    type: 'string',
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'Отчество пользователя',
    example: 'Иван',
    type: 'string',
  })
  readonly middleName: string;

  @ApiProperty({
    description: 'Дата рождения пользователя',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    nullable: true,
  })
  readonly birthDate: Date | null;

  @ApiProperty({
    description: 'Мобильный телефон пользователя',
    nullable: true,
    example: '+375291112233',
    type: 'string',
  })
  readonly phone: string | null;

  @ApiProperty({
    description: 'Может ли пользователь публиковать статьи',
    type: 'boolean',
    example: false,
  })
  readonly canPublish: boolean;

  @ApiProperty({
    description: 'Пол пользователя',
    example: Gender.MALE,
    enum: Gender,
  })
  readonly gender: Gender;

  @ApiProperty({
    description: 'Подтвержден ли пользователь',
    type: 'boolean',
    example: true,
  })
  readonly confirmed: boolean;

  @ApiProperty({
    description: 'Ссылка на аватар пользователя',
    type: 'string',
    example: 'https://example.com/avatar.png',
    nullable: true,
  })
  readonly avatarLink: string | null;

  @ApiProperty({
    description: 'Новый email пользователя',
    example: 'example@example.com',
    type: 'string',
    nullable: true,
  })
  readonly newEmail: string | null;

  @ApiProperty({
    description: 'Подтвержден ли новый email пользователя',
    example: false,
    type: 'boolean',
  })
  readonly newEmailConfirmed: boolean;

  @ApiProperty({
    description: 'Полное ФИО пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
