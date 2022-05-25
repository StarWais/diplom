import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFaqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  readonly answer?: string;
}
