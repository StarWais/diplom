import { BasicUserDto } from '../../../users/dto/response/basic-user.dto';

export class ArticleAuthorDto extends BasicUserDto {
  constructor(partial: Partial<BasicUserDto>) {
    super(partial);
  }
}
