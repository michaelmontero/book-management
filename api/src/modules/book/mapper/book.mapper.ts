import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookResponseDto } from '../dto/book-response.dto';
import { Book, BookDocument } from '../schema/book.schema';
import { AuthorMapper } from '##modules/author/mapper/author.mapper';

@Injectable()
export class BookMapper {
  /**
   * Maps CreateBookDto to Book entity for database insertion
   */
  static toEntity(createBookDto: CreateBookDto): Partial<Book> {
    return {
      title: createBookDto.title?.trim(),
      isbn: createBookDto.isbn?.trim().replace(/[-\s]/g, ''),
      authorId: new Types.ObjectId(createBookDto.authorId),
      publishedDate: createBookDto.publishedDate
        ? new Date(createBookDto.publishedDate)
        : undefined,
      genre: createBookDto.genre?.trim() || undefined,
      description: createBookDto.description?.trim() || undefined,
      pages: createBookDto.pages || undefined,
      language: createBookDto.language?.trim() || 'English',
      publisher: createBookDto.publisher?.trim() || undefined,
      coverImage: createBookDto.coverImage?.trim() || undefined,
      price: createBookDto.price || undefined,
      available:
        createBookDto.available !== undefined ? createBookDto.available : true,
    };
  }

  /**
   * Maps BookDocument to BookResponseDto for API response
   */
  static toResponseDto(bookDocument: BookDocument): BookResponseDto {
    if (!bookDocument) {
      throw new Error('BookDocument is required for mapping');
    }

    try {
      const responseDto = {
        id: bookDocument._id?.toString() || bookDocument.id,
        title: bookDocument.title,
        isbn: bookDocument.isbn,
        authorId: bookDocument.authorId?.toString(),
        author: AuthorMapper.mapBasicAuthor(bookDocument.author),
        publishedDate: bookDocument.publishedDate,
        genre: bookDocument.genre,
        description: bookDocument.description,
        pages: bookDocument.pages,
        language: bookDocument.language,
        publisher: bookDocument.publisher,
        coverImage: bookDocument.coverImage,
        price: bookDocument.price,
        available: bookDocument.available,
        createdAt: bookDocument.createdAt,
        updatedAt: bookDocument.updatedAt,
      } as BookResponseDto;

      return responseDto;
    } catch (error) {
      throw new Error(
        `Error mapping BookDocument to ResponseDto: ${error.message}`,
      );
    }
  }

  /**
   * Maps array of BookDocuments to array of BookResponseDtos
   */
  static toResponseDtoArray(bookDocuments: BookDocument[]): BookResponseDto[] {
    if (!Array.isArray(bookDocuments)) {
      return [];
    }

    return bookDocuments.map(this.toResponseDto);
  }

  /**
   * Maps BookDocument to a simplified response (for lists, etc.)
   */
  static toSimpleResponse(
    bookDocument: BookDocument,
  ): Partial<BookResponseDto> {
    return {
      id: bookDocument._id?.toString() || bookDocument.id,
      title: bookDocument.title,
      isbn: bookDocument.isbn,
      authorId: bookDocument.authorId?.toString(),
      author: AuthorMapper.mapBasicAuthor(bookDocument.author),
      genre: bookDocument.genre,
      coverImage: bookDocument.coverImage,
      price: bookDocument.price,
      available: bookDocument.available,
      createdAt: bookDocument.createdAt,
      updatedAt: bookDocument.updatedAt,
    };
  }

  /**
   * Maps array of BookDocuments to simplified responses
   */
  static toSimpleResponseArray(
    bookDocuments: BookDocument[],
  ): Partial<BookResponseDto>[] {
    if (!Array.isArray(bookDocuments)) {
      return [];
    }

    return bookDocuments.map(this.toSimpleResponse);
  }

 
}
