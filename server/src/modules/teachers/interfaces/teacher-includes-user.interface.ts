import { Teacher, User } from '@prisma/client';

export interface TeacherIncludesUser extends Teacher {
  user: User;
}
