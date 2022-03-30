import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  DATABASE_CONNECTION_URL: Joi.string().required(),
  PORT: Joi.number().default(8000),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_SECURE: Joi.boolean().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  BACKEND_DOMAIN: Joi.string().required(),
  FRONTEND_DOMAIN: Joi.string().required(),
});
