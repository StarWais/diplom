import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty({
    required: false,
    example: 'СШ №1',
  })
  @IsOptional()
  @IsNotEmpty()
  private readonly educationalInstitution?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(11)
  @ApiProperty({
    required: false,
    example: 8,
    type: 'integer',
  })
  private readonly grade?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    isArray: true,
    example: ['Иванов Иван Иванович', 'Петров Петр Петрович'],
  })
  private readonly teachers?: string[];
}
