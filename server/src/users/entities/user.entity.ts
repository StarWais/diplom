import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Gender, Role, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { UserAvatarEntity } from '.';

export class UserEntity implements User {
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  id: number;
  @ApiProperty({
    example: 'example@example.com',
  })
  email: string;
  @ApiProperty({ enum: Role, example: Role.STUDENT })
  role: Role;
  @ApiProperty({
    example: 'Иван',
  })
  firstName: string;
  @ApiProperty({
    example: 'Иванов',
  })
  lastName: string;
  @ApiProperty({
    example: 'Иванович',
  })
  middleName: string;
  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
    nullable: true,
  })
  birthDate: Date | null;
  @ApiProperty({
    example: '+3756666666',
    type: 'string',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender: Gender;

  @ApiProperty({
    example: true,
    type: 'boolean',
  })
  confirmed: boolean;
  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
    nullable: true,
  })
  createdAt: Date;
  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
    nullable: true,
  })
  updatedAt: Date;

  @ApiProperty({
    example: false,
    type: 'boolean',
  })
  canPublish: boolean;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({
    type: UserAvatarEntity,
  })
  avatar: UserAvatarEntity;

  @Expose()
  @ApiProperty({
    example: 'Иванов Иван Иванович',
  })
  get fullName(): string {
    return `${this.lastName} ${this.firstName} ${this.middleName} `;
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
