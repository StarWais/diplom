import { BadRequestException } from '@nestjs/common';

export class TaskVariantNotInRangeException extends BadRequestException {
  constructor(taskId: number, variantId: number) {
    super(
      `Вариант ответа с идентификатором ${variantId} не относится к заданию с идентификатором ${variantId}`,
    );
  }
}
