import { BasicUserDto } from '../../../users/dto/response/basic-user.dto';

export class ArticleCommentAuthorDto extends BasicUserDto {
  constructor(partial: Partial<ArticleCommentAuthorDto>) {
    super(partial);
  }
}
