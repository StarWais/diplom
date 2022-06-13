import { BadRequestException } from '@nestjs/common';

export class TasksNotInRangeException extends BadRequestException {
  constructor(public readonly invalidTaskIds: Array<number>, stepId: number) {
    super(
      `Задания с идентификаторами: ${invalidTaskIds.join(
        ', ',
      )} не найдены в этапе с идентификатором: ${stepId}`,
    );
  }
}
