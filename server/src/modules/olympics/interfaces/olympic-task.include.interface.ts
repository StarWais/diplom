import { Prisma } from '@prisma/client';

export interface OlympicTaskInclude {
  include: Prisma.OlympiadTaskInclude;
}
