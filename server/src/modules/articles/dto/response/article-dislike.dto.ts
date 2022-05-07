import { ArticleLikeBaseDto } from './article-like-base.dto';

export class ArticleDislikeDto extends ArticleLikeBaseDto {
  constructor(partial: Partial<ArticleDislikeDto>) {
    super(partial);
  }
}
