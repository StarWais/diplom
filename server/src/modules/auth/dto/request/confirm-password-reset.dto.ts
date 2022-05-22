import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { PasswordValidation } from 'class-validator-password-check/lib';

import { passwordRequirement } from './signup.dto';

export class ConfirmPasswordResetDto {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
    type: 'string',
    description: 'Токен для подтверждения восстановления пароля',
  })
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @ApiProperty({
    example: 'newPassword1!',
    description: 'Новый пароль',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  @Validate(PasswordValidation, [passwordRequirement])
  readonly newPassword: string;
}
