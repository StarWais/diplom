import { ArticleLikeBaseDto } from './article-like-base.dto';

export class ArticleLikeDto extends ArticleLikeBaseDto {
  constructor(partial: Partial<ArticleLikeDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
