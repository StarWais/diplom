import { NotFoundException } from '@nestjs/common';

export class ArticleNotFoundException extends NotFoundException {
  constructor(articleUniqueIdentifier: number | string) {
    super(`Статья с идентификатором ${articleUniqueIdentifier} не найдена`);
  }
}
