import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CourseApplicationCreateDto {
  @ApiProperty({
    example: 'Иванов Иван Иванович',
    description: 'ФИО заявителя',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly applicantName: string;

  @ApiProperty({
    example: '+375291234567',
    description: 'Мобильный телефон заявителя',
  })
  @IsNotEmpty()
  @IsPhoneNumber('BY')
  readonly applicantPhone: string;
}
