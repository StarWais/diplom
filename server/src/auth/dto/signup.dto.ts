import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';

import { IsEmailUserAlreadyExist } from '../../users/validators/users.validator';

export const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

export class SignupDto {
  @ApiProperty({
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 100)
  @IsEmailUserAlreadyExist({
    message: 'Пользователь с таким email уже существует',
  })
  readonly email: string;

  @ApiProperty({
    example: '12345678aA!',
  })
  @IsNotEmpty()
  @Length(8, 16)
  @Validate(PasswordValidation, [passwordRequirement])
  readonly password: string;

  @ApiProperty({
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  readonly gender: Gender;

  @ApiProperty({
    example: 'Иван',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly firstName: string;

  @ApiProperty({
    example: 'Иванов',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly lastName: string;

  @ApiProperty({
    example: 'Иванович',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly middleName: string;
}
