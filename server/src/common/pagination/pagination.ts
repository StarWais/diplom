import { PaginationQuery } from './pagination-query';
import { PrismaService } from 'nestjs-prisma';

export class Paginated<T> {
  nodes: T[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
}

export async function Paginate<T, U>(
  paginationQuery: PaginationQuery,
  prismaClient: PrismaService,
  entityName: string,
  args: Omit<U, 'skip' | 'take' | 'cursor'>,
  convertor: (item: T) => any = (item: T) => item,
): Promise<Paginated<T> | null> {
  const take = paginationQuery.limit || 20;
  const page = paginationQuery.page || 1;

  const skip = (page - 1) * take;

  const results = await prismaClient[entityName].findMany({
    skip,
    take,
    ...args,
  });

  const convertedResults: T[] = results.map(convertor);

  const totalCount = await prismaClient[entityName].count({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    where: args.where,
  });

  const totalPages = Math.ceil(totalCount / take);
  const hasNextPage = paginationQuery.page < totalPages;
  const hasPreviousPage = paginationQuery.page > 1;

  return {
    nodes: convertedResults,
    totalPages,
    currentPage: paginationQuery.page,
    hasNextPage,
    hasPreviousPage,
  };
}
