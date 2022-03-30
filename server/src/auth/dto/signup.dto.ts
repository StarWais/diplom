import { ApiProperty } from '@nestjs/swagger';
import { IsEmailUserAlreadyExist } from './../../users/validators/users.validator';
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

const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 100)
  @IsEmailUserAlreadyExist({
    message: 'Пользователь с таким email уже существует',
  })
  readonly email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Validate(PasswordValidation, [passwordRequirement])
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  readonly gender: Gender;

  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly lastName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsAlpha('ru-RU')
  readonly middleName: string;
}
