import { Course } from '@prisma/client';

import { StudentIncludesUser } from '@students/interfaces';

export interface CourseWithStudents extends Course {
  students: Array<StudentIncludesUser>;
}
