import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { Book, BookSchema } from './schema/book.schema';
import { BookController } from './book.controller';
import { AuthorModule } from '##modules/author/author.module';
import { WebsocketModule } from '##modules/websocket/websocket.module';

@Module({
  imports: [
    WebsocketModule,
    forwardRef(() => AuthorModule),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
