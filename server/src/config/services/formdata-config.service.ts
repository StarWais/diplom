import {
  FormDataInterceptorConfig,
  NestjsFormDataConfigFactory,
} from 'nestjs-form-data/dist/interfaces';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { FormDataOptions } from '../configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FormdataConfigService implements NestjsFormDataConfigFactory {
  constructor(private readonly config: ConfigService) {}

  configAsync():
    | Promise<FormDataInterceptorConfig>
    | FormDataInterceptorConfig {
    const config = this.config.get<FormDataOptions>('formDataOptions');
    return {
      storage: FileSystemStoredFile,
      fileSystemStoragePath: config.tempStorageDir,
    };
  }
}
