import { Prisma } from '@prisma/client';

export interface OlympicsApplicationInclude {
  include: Prisma.OlympiadApplicationInclude;
}
