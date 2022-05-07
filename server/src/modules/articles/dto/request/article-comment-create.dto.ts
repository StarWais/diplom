import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ArticleCommentCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(700)
  @ApiProperty({
    description: 'Текст комментария',
    type: 'string',
    example: 'Эта статья очень интересная!',
  })
  readonly text: string;
}
