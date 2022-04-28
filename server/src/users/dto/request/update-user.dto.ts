import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { SignupDto } from '../../../auth/dto/request';
import { IsDate, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(SignupDto, [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'gender',
  ] as const),
) {
  @ApiProperty({
    required: false,
    type: 'date-time',
    example: Date.now(),
  })
  @IsOptional()
  @IsDate()
  readonly birthDate?: Date;

  @ApiProperty({
    required: false,
    example: '+375291234567',
  })
  @IsOptional()
  @IsPhoneNumber('BY')
  readonly phone?: string;
}