import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { TeacherDto } from './teacher.dto';

export class TeacherUserDto extends TeacherDto {
  @Expose()
  @ApiProperty({
    description: 'Email пользователя',
    example: 'example@example.com',
    type: 'string',
  })
  readonly email: string;

  @Expose()
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    type: 'string',
  })
  readonly firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    type: 'string',
  })
  readonly lastName: string;

  @Expose()
  @ApiProperty({
    description: 'Отчество пользователя',
    example: 'Иван',
    type: 'string',
  })
  readonly middleName: string;

  @Expose()
  @ApiProperty({
    description: 'Мобильный телефон пользователя',
    nullable: true,
    example: '+375291112233',
    type: 'string',
  })
  readonly phone: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на аватар пользователя',
    type: 'string',
    example: 'https://example.com/avatar.png',
    nullable: true,
  })
  readonly avatarLink: string | null;

  @Expose()
  @ApiProperty({
    description: 'Полное ФИО пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }

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
