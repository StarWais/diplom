import { IsNumber } from 'class-validator';

export class FindOneParams {
  @IsNumber()
  id: number;
}
