import { NotFoundException } from '@nestjs/common';

export class ArticleCommentNotFoundException extends NotFoundException {
  constructor(commentId: number) {
    super(`Комментарий с идентификаторос ${commentId} не существует`);
  }
}
