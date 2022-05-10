import { Module } from '@nestjs/common';

import { StudentsService } from './services';

@Module({
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
