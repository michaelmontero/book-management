import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookResponseDto, BookAuthorDto } from '../dto/book-response.dto';
import { Book, BookDocument } from '../schema/book.schema';

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
        author: this.mapAuthor(bookDocument.author),
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

    return bookDocuments.map((doc) => this.toResponseDto(doc));
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
      author: this.mapAuthor(bookDocument.author),
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

    return bookDocuments.map((doc) => this.toSimpleResponse(doc));
  }

  /**
   * Helper method to map author data
   */
  private static mapAuthor(author: any): BookAuthorDto | undefined {
    if (!author) {
      return undefined;
    }

    return {
      id: author._id?.toString() || author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      fullName: `${author.firstName} ${author.lastName}`,
    };
  }

  /**
   * Helper method to check if update data has any actual changes
   */
  static hasChanges(updateData: Partial<Book>): boolean {
    return Object.keys(updateData).length > 0;
  }

  /**
   * Helper method to prepare data for search/filtering
   */
  static prepareSearchData(bookDocument: BookDocument): any {
    return {
      id: bookDocument._id?.toString(),
      title: bookDocument.title?.toLowerCase(),
      isbn: bookDocument.isbn,
      genre: bookDocument.genre?.toLowerCase(),
      description: bookDocument.description?.toLowerCase(),
      publisher: bookDocument.publisher?.toLowerCase(),
      searchText: [
        bookDocument.title,
        bookDocument.genre,
        bookDocument.description,
        bookDocument.publisher,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  }
}
