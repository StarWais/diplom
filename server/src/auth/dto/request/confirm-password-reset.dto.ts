import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Validate } from 'class-validator';
import { PasswordValidation } from 'class-validator-password-check/lib';
import { passwordRequirement } from './signup.dto';

export class ConfirmPasswordResetDto {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'newPassword1!',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'oldPassword1!',
  })
  @IsNotEmpty()
  @Length(8, 16)
  @Validate(PasswordValidation, [passwordRequirement])
  readonly newPassword: string;
}
