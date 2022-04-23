import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { FindOneParams } from '../common/params/find-one-params';
import { UpdateStudentDto } from './dto';
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
    description: 'Обновить данные студента',
  })
  @Patch(':id')
  async update(
    @Param() searchDetails: FindOneParams,
    @Body() details: UpdateStudentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.studentsService.update(searchDetails, details, currentUser);
  }
}
