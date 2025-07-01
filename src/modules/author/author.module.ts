import { forwardRef, Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorMapper } from './mapper/author.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './schema/author.schema';
import { BookModule } from '##modules/book/book.module';

@Module({
  imports: [
    forwardRef(() => BookModule),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorMapper],
  exports: [AuthorService],
})
export class AuthorModule {}
