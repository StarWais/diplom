import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'Информация об учителе',
  })
  readonly about?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    example: ['Математика', 'Информатика'],
    isArray: true,
  })
  readonly specialisations?: string[];

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'https://t.me/example',
  })
  readonly telegramLink?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'https://wahastapp.link/example',
  })
  readonly whatsappLink?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'https://viber.link/example',
  })
  readonly viberLink?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'https://vk.com/example',
  })
  readonly vkLink?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    required: false,
    example: 'https://skype.com/example',
  })
  readonly skypeLink?: string;
}
