import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({}));

  app.enableCors(
    isProd
      ? {
          origin: configService.get('FRONTEND_URL'),
          credentials: true,
        }
      : {},
  );
  const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLE');
  if (isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Library Management API')
      .setDescription('API for managing authors and books')
      .setVersion('1.0')
      .addTag('authors')
      .addTag('books')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  if (isSwaggerEnabled)
    console.log(
      `📚 Swagger docs available at: http://localhost:${port}/api/docs`,
    );
}

bootstrap();
