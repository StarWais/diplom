import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
  })
  @IsNotEmpty()
  token: string;
}
