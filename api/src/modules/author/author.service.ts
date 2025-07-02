import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { type Model, isValidObjectId } from 'mongoose';
import type { CreateAuthorDto } from './dto/create-author.dto';
import type { AuthorResponseDto } from './dto/author-response.dto';
import type { QueryAuthorDto } from './dto/query-author.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from 'src/common/dto/pagination.dto';
import { AuthorMapper } from './mapper/author.mapper';
import { Author, AuthorDocument } from './schema/author.schema';
import { BookService } from '../book/book.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      const savedAuthor = await this.createAuthor(createAuthorDto);

      // 2. If books are provided, create them
      const createdBooks = [];
      if (createAuthorDto.books && createAuthorDto.books.length > 0) {
        for (const bookData of createAuthorDto.books) {
          try {
            const createdBook = await this.createBookForAuthor(
              bookData,
              savedAuthor._id.toString(),
            );
            createdBooks.push(createdBook);
          } catch (error) {
            console.error(
              `Failed to create book "${bookData.title}":`,
              error.message,
            );
          }
        }
      }

      const populatedAuthor = await this.getAuthorWithBooks(
        savedAuthor._id.toString(),
      );

      const response = AuthorMapper.toResponseDto(populatedAuthor);

      return response;
    } catch (error) {
      return this.handleCreateError(error);
    }
  }

  /**
   * Creates only the author (private method for reusability)
   */
  private async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorDocument> {
    try {
      const authorData = AuthorMapper.toEntity(createAuthorDto);
      const createdAuthor = new this.authorModel(authorData);
      return await createdAuthor.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new ConflictException('Author with this email already exists');
      }
      throw new BadRequestException(`Error creating author: ${error.message}`);
    }
  }

  /**
   * Creates a book for a specific author using BookService
   */
  private async createBookForAuthor(
    bookData: any,
    authorId: string,
  ): Promise<any> {
    try {
      // Omit authorId from bookData and use the one we pass
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorId: _, ...bookWithoutAuthorId } = bookData;

      const bookDto = {
        ...bookWithoutAuthorId,
        authorId: authorId, // Use the authorId from the created author
      };

      return await this.bookService.create(bookDto);
    } catch (error) {
      // If book creation fails, the author was already created
      console.error(
        `Failed to create book for author ${authorId}:`,
        error.message,
      );

      // Re-throw the error so the controller can handle it
      throw error;
    }
  }

  /**
   * Gets an author with their books populated
   */
  private async getAuthorWithBooks(authorId: string): Promise<AuthorDocument> {
    return await this.authorModel.findById(authorId).populate('books').exec();
  }

  /**
   * Handles errors during creation
   */
  private handleCreateError(error: any): never {
    if (
      error instanceof ConflictException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }

    throw new BadRequestException(
      `Unexpected error during author creation: ${error.message}`,
    );
  }

  /**
   * Retrieves paginated list of authors with their books
   */
  async findAllPaginated(
    query: QueryAuthorDto,
  ): Promise<PaginatedResponseDto<AuthorResponseDto>> {
    const { page = 1, limit = 10 } = query;
    const filter: any = {};

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      this.authorModel
        .find(filter)
        .populate('books')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.authorModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };

    const data = AuthorMapper.toResponseDtoArray(authors);

    return new PaginatedResponseDto(data, meta);
  }

  /**
   * Finds a single author by ID with their books
   */
  async findOne(id: string): Promise<AuthorResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const author = await this.authorModel
        .findById(id)
        .populate('books')
        .exec();

      if (!author) {
        throw new NotFoundException(`Author with ID ${id} not found`);
      }

      return AuthorMapper.toResponseDto(author);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error retrieving author: ${error.message}`,
      );
    }
  }

  /**
   * Removes an author by ID
   */
  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deletedAuthor = await this.authorModel.findByIdAndDelete(id).exec();

    if (!deletedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }

  /**
   * Checks if an author exists by ID
   */
  async exists(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const count = await this.authorModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  /**
   * Method to get authors with their books populated
   */
  async findWithBooks(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const author = await this.authorModel.findById(id).populate('books').exec();

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }
}
