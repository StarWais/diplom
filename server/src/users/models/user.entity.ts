import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Gender, Role, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements User {
  id: number;
  email: string;
  @ApiProperty({ enum: Role })
  role: Role;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date | null;
  phone: string | null;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @Expose()
  @ApiProperty()
  get fullName(): string {
    return `${this.lastName} ${this.firstName} ${this.middleName} `;
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
