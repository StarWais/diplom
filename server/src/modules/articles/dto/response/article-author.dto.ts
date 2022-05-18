import { BasicUserDto } from '../../../users/dto/response';

import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleAuthorDto extends BasicUserDto {
  @Expose()
  @ApiProperty({
    description: 'Полное ФИО пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  constructor(partial: Partial<ArticleAuthorDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
