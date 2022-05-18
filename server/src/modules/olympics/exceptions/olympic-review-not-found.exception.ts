import { BadRequestException } from '@nestjs/common';

export class OlympicReviewNotFoundException extends BadRequestException {
  constructor(olympiadReviewId: number) {
    super(`Отзыв на олимпиаду с идентификатором ${olympiadReviewId} не найден`);
  }
}
