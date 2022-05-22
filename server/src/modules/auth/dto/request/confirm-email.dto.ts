import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
    description: 'Токен подтверждения',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
