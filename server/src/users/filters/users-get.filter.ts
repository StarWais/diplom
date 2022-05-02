import { PaginationQuery } from '../../common/pagination/pagination-query';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UsersGetFilter extends PaginationQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Новость',
    required: false,
  })
  search?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    example: Role.ADMIN,
    required: false,
    enum: Role,
  })
  role?: Role;
}
