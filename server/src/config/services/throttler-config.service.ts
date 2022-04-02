import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { ThrottlerOptions } from '../configuration';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createThrottlerOptions():
    | ThrottlerModuleOptions
    | Promise<ThrottlerModuleOptions> {
    const config = this.configService.get<ThrottlerOptions>('throttlerOptions');
    return config;
  }
}
