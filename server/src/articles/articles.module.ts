import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [UsersModule],
})
export class ArticlesModule {}
