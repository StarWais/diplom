import { BasicUserDto } from '../../../users/dto/response';

export class ArticleCommentAuthorDto extends BasicUserDto {
  constructor(partial: Partial<ArticleCommentAuthorDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
