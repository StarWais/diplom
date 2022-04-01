import { ValidationError } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

export interface SwaggerOptions {
  title: string;
  description: string;
  version: string;
  swaggerPath: string;
}

export interface AuthOptions {
  jwt: {
    secret: string;
    expiresIn: string;
  };
  registrationTokenOptions: ConfirmationTokenOptions;
  passwordResetTokenOptions: ConfirmationTokenOptions;
  ignoreExpiration: boolean;
}

export interface EmailOptions {
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  author: {
    name: string;
    email: string;
  };
}

export interface DomainOptions {
  backend: string;
  frontend: string;
}

export interface GlobalConfig {
  port: number;
  development: boolean;
  validatorOptions: ValidationPipeOptions;
  authOptions: AuthOptions;
  swaggerOptions: SwaggerOptions;
  emailOptions: EmailOptions;
  domainOptions: DomainOptions;
}

export interface ConfirmationTokenOptions {
  length: number;
  expiresIn: number;
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
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    ignoreExpiration: process.env.NODE_ENV === 'development',
    registrationTokenOptions: {
      length: 12,
      expiresIn: 60 * 60 * 24 * 7,
    },
    passwordResetTokenOptions: {
      length: 12,
      expiresIn: 60 * 60 * 24 * 7,
    },
  },
  swaggerOptions: {
    title: 'Школа точных наук',
    description: 'Дипломный проект',
    version: '1.0',
    swaggerPath: 'swagger',
  },
  emailOptions: {
    transport: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10) || 25,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    author: {
      name: 'Школа точных наук',
      email: 'fathermkv@gmail.com',
    },
  },
  domainOptions: {
    backend: process.env.BACKEND_DOMAIN,
    frontend: process.env.FRONTEND_DOMAIN,
  },
});
