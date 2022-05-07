import { NotFoundException } from '@nestjs/common';

export class NewsNotFoundException extends NotFoundException {
  constructor(newsUniqueIdentifier: string | number) {
    super(`Новость с идентификатором ${newsUniqueIdentifier} не найдена`);
  }
}
