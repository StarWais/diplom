import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { FormdataConfigService } from '../../config/services';
import { NewsController } from './controllers';
import { NewsService } from './services';

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
