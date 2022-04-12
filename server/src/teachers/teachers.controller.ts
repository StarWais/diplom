import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { RolesGuard } from './../auth/guards/roles.guard';
import { TeachersService } from './teachers.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTeacherDto } from './dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Учителя')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Сделать пользователя учителем',
  })
  @Post()
  async create(@Body() details: CreateTeacherDto) {
    return this.teachersService.create(details);
  }
}
