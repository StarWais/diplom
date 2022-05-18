import { Prisma } from '@prisma/client';

export interface OlympicsBaseIncludes {
  include: Prisma.OlympiadInclude;
}
