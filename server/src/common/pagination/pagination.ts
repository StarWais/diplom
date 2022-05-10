import { PrismaService } from 'nestjs-prisma';
import { applyDecorators, Type as NType } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginationQuery } from './pagination-query';
import { Expose, Type } from 'class-transformer';

export class PaginatedDto<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly type: Function;

  @Expose()
  @Type((type) => type.newObject.type)
  readonly nodes: T[];

  @Expose()
  @ApiProperty({
    description: 'Всего страниц',
    example: 3,
    type: 'integer',
  })
  readonly totalPages: number;

  @Expose()
  @ApiProperty({
    description: 'Есть ли следующая страница',
    example: true,
    type: 'boolean',
  })
  readonly hasNextPage: boolean;

  @Expose()
  @ApiProperty({
    description: 'Есть ли предыдущая страница',
    example: true,
    type: 'boolean',
  })
  readonly hasPreviousPage: boolean;

  @Expose()
  @ApiProperty({
    description: 'Текущая страница',
    example: 2,
    type: 'integer',
  })
  readonly currentPage: number;

  constructor(partial: Partial<PaginatedDto<T>>) {
    Object.assign(this, partial);
  }
}

export const ApiPaginatedResponse = <TModel extends NType>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
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

export async function Paginate<TArgs>(
  dto: any,
  paginationQuery: PaginationQuery,
  prismaClient: PrismaService,
  entityName: string,
  args: Omit<TArgs, 'skip' | 'take' | 'cursor'>,
  convertor: (item: typeof dto) => any = (item: typeof dto) => item,
): Promise<PaginatedDto<typeof dto>> {
  const take = paginationQuery.limit || 20;
  const page = paginationQuery.page || 1;

  const skip = (page - 1) * take;

  const results = await prismaClient[entityName].findMany({
    skip,
    take,
    ...args,
  });

  const convertedResults: typeof dto[] = results.map(convertor);

  const totalCount = await prismaClient[entityName].count({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    where: args.where,
  });

  const totalPages = Math.ceil(totalCount / take);
  const hasNextPage = paginationQuery.page < totalPages;
  const hasPreviousPage = paginationQuery.page > 1;

  return new PaginatedDto<typeof dto>({
    nodes: convertedResults,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    currentPage: paginationQuery.page,
    type: dto,
  });
}
