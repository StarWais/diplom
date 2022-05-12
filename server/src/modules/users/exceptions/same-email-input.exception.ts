import { BadRequestException } from '@nestjs/common';

export class SameEmailInputException extends BadRequestException {
  constructor() {
    super(
      'Вы не можете изменить свой почтовый адрес на такой же, какой вы уже используете.',
    );
  }
}
