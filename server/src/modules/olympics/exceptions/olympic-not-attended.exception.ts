import { BadRequestException } from '@nestjs/common';

export class OlympicNotAttendedException extends BadRequestException {
  constructor(olympiadId: number) {
    super(
      `Вы не принимали участие в олимпиаде с идентификатором ${olympiadId}`,
    );
  }
}
