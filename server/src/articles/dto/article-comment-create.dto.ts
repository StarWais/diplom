import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class ArticleCommentCreateDto {
  @IsNotEmpty()
  @MaxLength(700)
  @ApiProperty()
  readonly text: string;
}
