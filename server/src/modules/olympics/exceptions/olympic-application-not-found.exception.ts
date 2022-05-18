import { BadRequestException } from '@nestjs/common';

export class OlympicApplicationNotFoundException extends BadRequestException {
  constructor(olympicApplicationId: number) {
    super(
      `Заявка на олимпиаду с идентификатором ${olympicApplicationId} не найдена`,
    );
  }
}
