import { ValidationError } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
  ignoreExpiration: boolean;
}

export interface GlobalConfig {
  port: number;
  development: boolean;
  validatorOptions: ValidationPipeOptions;
  authOptions: AuthConfig;
}

export default (): GlobalConfig => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  development: process.env.NODE_ENV === 'development',
  validatorOptions: {
    transform: true,
    whitelist: true,
    enableDebugMessages: process.env.NODE_ENV === 'development',
  },
  authOptions: {
    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiresIn: process.env.JWT_EXPIRES_IN || '',
    },
    ignoreExpiration: process.env.NODE_ENV === 'development',
  },
});
