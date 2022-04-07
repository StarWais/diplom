import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from '../config/configuration';
import {
  PrismaConfigService,
  MailerConfigService,
  ThrottlerConfigService,
} from '../config/services';
import { validationSchema } from '../config/env/env-validation';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { CoursesModule } from '../courses/courses.module';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottlerConfigService,
    }),
    UsersModule,
    AuthModule,
    ArticlesModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule {}
