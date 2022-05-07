import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '12345678aA',
    description: 'Пароль пользователя',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
