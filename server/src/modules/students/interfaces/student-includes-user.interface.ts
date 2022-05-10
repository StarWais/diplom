import { Student, User } from '@prisma/client';

export interface StudentIncludesUser extends Student {
  user: User;
}
