import { PaginationQuery } from './pagination-query';
import { PrismaService } from 'nestjs-prisma';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class PaginatedDto<T> {
  nodes: T[];
  @ApiProperty({
    description: 'Всего страниц',
    example: 3,
    type: 'integer',
  })
  totalPages: number;

  @ApiProperty({
    description: 'Есть ли следующая страница',
    example: true,
    type: 'boolean',
  })
  hasNextPage: boolean;
  @ApiProperty({
    description: 'Есть ли предыдущая страница',
    example: true,
    type: 'boolean',
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Текущая страница',
    example: 2,
    type: 'integer',
  })
  currentPage: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Данные пагинации',
      schema: {
        description: `Пагинация для ${getSchemaPath(model)}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              nodes: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
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
  args: Omit<U, 'skip' | 'take' | 'cursor'>,
  convertor: (item: T) => any = (item: T) => item,
): Promise<PaginatedDto<T> | null> {
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
