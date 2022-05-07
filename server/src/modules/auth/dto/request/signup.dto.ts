import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';

import { IsEmailUserAlreadyExist } from '../../../users/validators/users.validator';

export const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

export class SignupDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(6, 100)
  @IsEmailUserAlreadyExist({
    message: 'Пользователь с таким email уже существует',
  })
  readonly email: string;

  @ApiProperty({
    example: '12345678aA!',
    description: 'Пароль пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  @Validate(PasswordValidation, [passwordRequirement])
  readonly password: string;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
    description: 'Пол пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly lastName: string;

  @ApiProperty({
    example: 'Иванович',
    description: 'Отчество пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly middleName: string;
}
