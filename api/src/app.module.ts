import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '##modules/health/health.module';
import { LibraryConfigModule } from '##modules/config/config.module';
import { BookModule } from '##modules/book/book.module';
import { AuthorModule } from '##modules/author/author.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

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
    BookModule,
    WebsocketModule,
  ],
})
export class AppModule {}
