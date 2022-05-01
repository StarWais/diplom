import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { FindOneParams } from '../common/params/find-one-params';
import { UpdateStudentDto } from './dto/request';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';

@Controller('students')
@ApiTags('Студенты')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить данные студента',
  })
  @Patch(':id')
  async update(
    @Param() searchDetails: FindOneParams,
    @Body() details: UpdateStudentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.studentsService.update(searchDetails, details, currentUser);
  }

  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить данные студента',
  })
  @Get(':id')
  async get(@Param() searchDetails: FindOneParams) {
    return this.studentsService.getStudent(searchDetails);
  }
}
