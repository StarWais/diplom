import { BasicUserDto } from '../../../users/dto/response';

export class ArticleAuthorDto extends BasicUserDto {
  constructor(partial: Partial<ArticleAuthorDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
