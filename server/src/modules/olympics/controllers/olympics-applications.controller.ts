import { OlympicsApplicationsService } from '@olympics/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindByOlympicsIdParams,
  FindOlympicApplicationParams,
} from '@olympics/params';
import { OlympicApplicationCreateDto } from '@olympics/dto/request';
import { CurrentUser } from '@common/decorators';
import { Role, User } from '@prisma/client';
import { PaginationQuery } from '@pagination/pagination-query';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { OlympicApplicationDto } from '@olympics/dto/response';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics/:olympicsId/applications')
@ApiTags('Заявки на олимпиады')
export class OlympicsApplicationsController {
  constructor(
    private readonly olympicsApplicationsService: OlympicsApplicationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Создать заявку на олимпиаду',
    description: 'Доступно только студенту',
  })
  @ApiCreatedResponse({
    description: 'Заявка на олимпиаду успешно создана',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Param() searchParams: FindByOlympicsIdParams,
    @Body() details: OlympicApplicationCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<void> {
    await this.olympicsApplicationsService.create(
      searchParams,
      details,
      currentUser,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить заявку на олимпиаду',
    description: 'Доступно только администратору',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Заявка на олимпиаду',
    type: OlympicApplicationDto,
  })
  async findOne(
    @Param() searchParams: FindOlympicApplicationParams,
  ): Promise<OlympicApplicationDto> {
    return this.olympicsApplicationsService.findOneOrThrowError(searchParams);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить заявку на олимпиаду',
    description: 'Доступно только администратору',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Заявка на олимпиаду успешно удалена',
  })
  async delete(
    @Param() searchParams: FindOlympicApplicationParams,
  ): Promise<void> {
    await this.olympicsApplicationsService.delete(searchParams);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список заявок на олимпиаду',
    description: 'Доступно только администратору',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiPaginatedResponse(OlympicApplicationDto)
  async findMany(
    @Param() searchParams: FindOlympicApplicationParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<OlympicApplicationDto>> {
    return this.olympicsApplicationsService.findMany(searchParams, filter);
  }
}
