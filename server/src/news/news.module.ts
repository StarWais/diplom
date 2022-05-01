import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { FormdataConfigService } from '../config/services';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
})
export class NewsModule {}
