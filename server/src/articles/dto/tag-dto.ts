import { Transform } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class ArticleTagDto {
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  readonly name: string;
}
