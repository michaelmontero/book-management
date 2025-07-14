import { forwardRef, Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './schema/author.schema';
import { BookModule } from '##modules/book/book.module';
import { WebsocketModule } from '##modules/websocket/websocket.module';

@Module({
  imports: [
    WebsocketModule,
    forwardRef(() => BookModule),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
