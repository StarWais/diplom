import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { applyDecorators, Type } from '@nestjs/common';

import { PaginationQuery } from './pagination-query';
import { PrismaService } from 'nestjs-prisma';

export class Paginated<T> {
  nodes: T[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
}

export const ApiPaginatedDto = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        description,
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              nodes: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              totalPages: {
                type: 'integer',
                example: 3,
              },
              hasNextPage: {
                type: 'boolean',
                example: true,
              },
              hasPreviousPage: {
                type: 'boolean',
                example: false,
              },
              currentPage: {
                type: 'integer',
                example: 1,
              },
            },
          },
        ],
      },
    }),
  );
};

export async function Paginate<T, U>(
  paginationQuery: PaginationQuery,
  prismaClient: PrismaService,
  entityName: string,
  args: U,
  convertor: (item: T) => any = (item: T) => item,
): Promise<Paginated<T> | null> {
  const take = paginationQuery.limit || 20;
  const skip = (paginationQuery.page ? paginationQuery.page - 1 : 1) * take;

  const results = await prismaClient[entityName].findMany({
    skip,
    take,
    where: args,
  });

  const convertedResults: T[] = results.map(convertor);

  const totalCount = await prismaClient[entityName].count({
    where: args,
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
