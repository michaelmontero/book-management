import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '##modules/health/health.module';
import { LibraryConfigModule } from '##modules/config/config.module';
import { AuthorModule } from './modules/author/author.module';

@Module({
  imports: [
    LibraryConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    AuthorModule,
  ],
})
export class AppModule {}
