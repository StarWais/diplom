import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly question: string;
}
