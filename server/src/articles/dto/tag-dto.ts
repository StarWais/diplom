import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class ArticleTagDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @MaxLength(50)
  name: string;
}
