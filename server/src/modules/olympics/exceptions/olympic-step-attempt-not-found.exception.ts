import { NotFoundException } from '@nestjs/common';

export class OlympicStepAttemptNotFoundException extends NotFoundException {
  constructor(olympicStepAttemptId: number) {
    super(
      `Попытка завершения этапа с идентификатором ${olympicStepAttemptId} не найдена`,
    );
  }
}
