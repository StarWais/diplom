import { Prisma } from '@prisma/client';

export interface NewsInclude {
  include: Prisma.NewsInclude;
}
