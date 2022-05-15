import { BadRequestException } from '@nestjs/common';

export class OlympicAlreadyReviewedException extends BadRequestException {
  constructor(olympiadId: number) {
    super(`Вы уже оценили олимпиаду с идентификатором ${olympiadId}`);
  }
}
