import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import configuration from '../config/configuration';
import {
  MailerConfigService,
  PrismaConfigService,
  ThrottlerConfigService,
} from '@config/services';
import { validationSchema } from '@config/env/env-validation';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ArticlesModule } from '@articles/articles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImagesModule } from '@images/images.module';
import { NewsModule } from '@news/news.module';
import { CoursesModule } from '@courses/courses.module';
import { StudentsModule } from '@students/students.module';
import { TeachersModule } from '@teachers/teachers.module';
import { InfoModule } from '@info/info.module';
import { FaqModule } from '@faq/faq.module';
import { OlympicsModule } from '@olympics/olympics.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
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
    ScheduleModule.forRoot(),
    ImagesModule,
    UsersModule,
    AuthModule,
    ArticlesModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
    InfoModule,
    NewsModule,
    OlympicsModule,
    FaqModule,
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
