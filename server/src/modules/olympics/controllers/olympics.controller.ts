import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { OlympicsService } from '../services';
import { OlympicCreateDto, OlympicUpdateDto } from '@olympics/dto/request';
import { OlympicDto, OlympicListedMyDto } from '@olympics/dto/response';
import { GetMyOlympicsFilter, GetOlympicsFilter } from '@olympics/filters';
import { CurrentUser } from '@common/decorators';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { Role, User } from '@prisma/client';
import { FindOneByIDParams } from '@common/params';
import { OlympicListedBaseDto } from '@olympics/dto/response/olympic-listed-base.dto';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics')
@ApiTags('Олимпиады')
export class OlympicsController {
  constructor(private olympicsService: OlympicsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Создать олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiCreatedResponse({
    description: 'Олимпиада успешно создана',
    type: OlympicDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() details: OlympicCreateDto): Promise<OlympicDto> {
    return this.olympicsService.create(details);
  }

  @Get('my')
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Получить мои олимпиады',
    description: 'Доступно только студенту',
  })
  @ApiPaginatedResponse(OlympicListedMyDto)
  async findMy(
    @Query() query: GetMyOlympicsFilter,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<OlympicListedMyDto>> {
    return this.olympicsService.findMy(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить олимпиаду по идентификатору',
  })
  @ApiOkResponse({
    description: 'Олимпиада',
    type: OlympicDto,
  })
  async findOne(@Param() searchParams: FindOneByIDParams): Promise<OlympicDto> {
    return this.olympicsService.findOneOrThrowError(searchParams);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Обновить олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Олимпиада успешно обновлена',
    type: OlympicDto,
  })
  async update(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: OlympicUpdateDto,
  ): Promise<OlympicDto> {
    return this.olympicsService.update(searchParams, details);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Удалить олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Олимпиада успешно удалена',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() searchParams: FindOneByIDParams): Promise<void> {
    await this.olympicsService.delete(searchParams);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список всех олимпиад',
  })
  @ApiPaginatedResponse(OlympicListedBaseDto)
  async findMany(
    @Query() query: GetOlympicsFilter,
  ): Promise<PaginatedDto<OlympicListedBaseDto>> {
    return this.olympicsService.findMany(query);
  }
}
