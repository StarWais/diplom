import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { v4 } from 'uuid';
import * as Sharp from 'sharp';

import { DomainOptions, FormDataOptions } from '@config/configuration';

@Injectable()
export class ImagesService {
  constructor(private readonly config: ConfigService) {}
  async save(image: FileSystemStoredFile): Promise<string> {
    const fileName = `${v4()}.avif`;
    const path = `${
      this.config.get<FormDataOptions>('formDataOptions').uploadsDir
    }/${fileName}`;
    const domain = this.config.get<DomainOptions>('domainOptions').backend;
    await Sharp(image.path)
      .resize(300, 300)
      .avif({ quality: 100 })
      .toFile(path);

    return `${domain}/uploads/${fileName}`;
  }
}
