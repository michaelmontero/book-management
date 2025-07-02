import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { BookMapper } from './mapper/book.mapper';
import { Book, BookSchema } from './schema/book.schema';
import { BookController } from './book.controller';
import { AuthorModule } from '##modules/author/author.module';

@Module({
  imports: [
    forwardRef(() => AuthorModule),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService, BookMapper],
  exports: [BookService, BookMapper],
})
export class BookModule {}
