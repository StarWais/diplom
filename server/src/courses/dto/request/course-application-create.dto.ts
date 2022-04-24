import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MaxLength } from 'class-validator';

export class CourseApplicationCreateDto {
  @ApiProperty({
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty()
  @MaxLength(255)
  readonly appliciantName: string;

  @ApiProperty({
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty()
  @IsPhoneNumber('BY')
  readonly appliciantPhone: string;
}
