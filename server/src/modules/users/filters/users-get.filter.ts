import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { PaginationQuery } from '@pagination/pagination-query';

export class UsersGetFilter extends PaginationQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Новость',
    required: false,
  })
  readonly search?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    example: Role.ADMIN,
    required: false,
    enum: Role,
  })
  readonly role?: Role;
}
