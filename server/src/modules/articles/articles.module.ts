import { Module } from '@nestjs/common';

import { ArticlesCommentsService, ArticlesService } from './services';
import { ArticlesCommentsController, ArticlesController } from './controllers';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ArticlesService, ArticlesCommentsService],
  controllers: [ArticlesController, ArticlesCommentsController],
  imports: [UsersModule],
})
export class ArticlesModule {}
