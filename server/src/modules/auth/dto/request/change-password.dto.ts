import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ConfirmPasswordResetDto } from './confirm-password-reset.dto';

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
