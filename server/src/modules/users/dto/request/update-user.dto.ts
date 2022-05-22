import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { SignupDto } from '@auth/dto/request';
import { UpdateStudentDto } from './update-student.dto';
import { UpdateTeacherDto } from './update-teacher.dto';

export class UpdateUserDto extends PartialType(
  PickType(SignupDto, [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'gender',
  ] as const),
) {
  @ApiProperty({
    required: false,
    type: 'date-time',
    example: Date.now(),
  })
  @IsOptional()
  @IsDate()
  readonly birthDate?: Date;

  @ApiProperty({
    required: false,
    example: '+375291234567',
  })
  @IsOptional()
  @IsPhoneNumber('BY')
  readonly phone?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: UpdateStudentDto,
  })
  @Type(() => UpdateStudentDto)
  readonly studentInfo?: UpdateStudentDto;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: UpdateTeacherDto,
  })
  @Type(() => UpdateTeacherDto)
  readonly teacherInfo?: UpdateTeacherDto;
}
