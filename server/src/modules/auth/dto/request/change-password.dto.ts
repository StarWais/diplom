import { ApiProperty, PickType } from '@nestjs/swagger';
import { ConfirmPasswordResetDto } from './confirm-password-reset.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto extends PickType(ConfirmPasswordResetDto, [
  'newPassword',
] as const) {
  @ApiProperty({
    example: 'oldPassword1!',
    description: 'Старый пароль',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;
}
