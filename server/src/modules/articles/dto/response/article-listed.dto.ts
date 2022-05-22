import { OmitType } from '@nestjs/swagger';

import { ArticleDto } from './article.dto';

export class ArticleListedDto extends OmitType(ArticleDto, [
  'likes',
  'dislikes',
  'views',
] as const) {
  constructor(partial: Partial<ArticleListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
