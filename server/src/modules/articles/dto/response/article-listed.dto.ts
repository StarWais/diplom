import { OmitType } from '@nestjs/swagger';
import { ArticleDto } from './article.dto';

export class ArticleListedDto extends OmitType(ArticleDto, [
  'likes',
  'dislikes',
  'views',
] as const) {
  constructor(article: Partial<ArticleDto>) {
    super(article);
  }
}
