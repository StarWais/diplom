import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor(commentId: number) {
    super(`Комментарий с ID ${commentId} не существует`);
  }
}
