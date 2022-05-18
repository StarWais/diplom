import { Prisma } from '@prisma/client';

export interface OlympicReviewInclude {
  include: Prisma.OlympiadReviewInclude;
}
