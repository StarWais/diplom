import { OlympiadApplication } from '@prisma/client';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { StudentIncludesUser } from '../../../students/interfaces';
import { BasicUserDto } from '../../../users/dto/response';
import { CourseDto } from '../../../courses/dto/response';
import { OlympicDto } from './olympic.dto';

export class OlympicApplicationDto
  extends BaseAbstractDto
  implements OlympiadApplication
{
  @Expose()
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'ID олимпиады',
  })
  readonly olympiadId: number;

  @Expose()
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'ID студента',
  })
  readonly studentId: number;

  @Expose()
  @ApiProperty({
    type: () => PickType(CourseDto, ['id', 'name'] as const),
    description: 'Информация об олимпиаде',
  })
  @Type(() => PickType(OlympicDto, ['id', 'name'] as const))
  readonly olympiad: Pick<OlympicDto, 'name' | 'id'>;

  @Exclude()
  readonly student: StudentIncludesUser | null;
  @Expose()
  @ApiProperty({
    type: () => BasicUserDto,
    description: 'Информация о студенте',
    nullable: true,
  })
  @Type(() => BasicUserDto)
  get user(): BasicUserDto | null {
    return (this.student?.user as unknown as BasicUserDto) || null;
  }
}
