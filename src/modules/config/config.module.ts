import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const IS_TEST =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'e2e';

// Custom boolean transformation for environment variables
const booleanFromString = (defaultValue: boolean = false) =>
  Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.string()
        .valid('true', 'false', '1', '0', 'yes', 'no')
        .custom((value) => {
          if (value === 'true' || value === '1' || value === 'yes') return true;
          if (value === 'false' || value === '0' || value === 'no')
            return false;
          return defaultValue;
        }),
    )
    .default(defaultValue);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: !IS_TEST
        ? Joi.object({
            // Application
            NODE_ENV: Joi.string()
              .valid('local', 'development', 'production', 'test', 'e2e')
              .default('development'),
            PORT: Joi.number().default(3001),
            TZ: Joi.string().default('America/New_York'),

            // Frontend
            FRONTEND_URL: Joi.string().default('http://localhost:3000'),

            // Database
            MONGODB_URI: Joi.string().required(),

            // Swagger
            SWAGGER_ENABLE: booleanFromString().default('false'),
            SWAGGER_PATH: Joi.string().default('api/docs'),
          })
        : undefined,
    }),
  ],
  exports: [ConfigModule],
})
export class LibraryConfigModule {}
