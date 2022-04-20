import { Module, Global } from '@nestjs/common';
import { ImagesService } from './images.service';

@Global()
@Module({
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
