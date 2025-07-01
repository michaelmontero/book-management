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
    private readonly authorMapper: AuthorMapper,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      // 1. Crear el autor primero
      const savedAuthor = await this.createAuthor(createAuthorDto);

      // 2. Si vienen libros, crearlos
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
            // Continúa con los otros libros en lugar de fallar completamente
          }
        }
      }

      // 3. Obtener el autor actualizado con bookCount
      const populatedAuthor = await this.getAuthorWithBookCount(
        savedAuthor._id.toString(),
      );

      // 4. Preparar respuesta
      const response = this.authorMapper.toResponseDto(populatedAuthor);

      // 5. Agregar los libros creados a la respuesta si existen
      if (createdBooks.length > 0) {
        response.books = createdBooks;
      }

      return response;
    } catch (error) {
      return this.handleCreateError(error);
    }
  }

  /**
   * Crea solo el autor (método privado para reutilización)
   */
  private async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorDocument> {
    try {
      const authorData = this.authorMapper.toEntity(createAuthorDto);
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
   * Crea un libro para un autor específico usando BookService
   */
  private async createBookForAuthor(
    bookData: any,
    authorId: string,
  ): Promise<any> {
    try {
      // Omitir authorId del bookData y usar el que pasamos
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorId: _, ...bookWithoutAuthorId } = bookData;

      const bookDto = {
        ...bookWithoutAuthorId,
        authorId: authorId, // Usar el authorId del autor creado
      };

      // Usar BookService directamente - él se encarga de todo
      return await this.bookService.create(bookDto);
    } catch (error) {
      // Si falla la creación del libro, el autor ya fue creado
      console.error(
        `Failed to create book for author ${authorId}:`,
        error.message,
      );

      // Re-lanzar el error para que el controller lo maneje
      throw error;
    }
  }

  /**
   * Obtiene un autor con el bookCount actualizado
   */
  private async getAuthorWithBookCount(
    authorId: string,
  ): Promise<AuthorDocument> {
    return await this.authorModel
      .findById(authorId)
      .populate('bookCount')
      .exec();
  }

  /**
   * Maneja errores durante la creación
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

  async findAllPaginated(
    query: QueryAuthorDto,
  ): Promise<PaginatedResponseDto<AuthorResponseDto>> {
    const { page = 1, limit = 10 } = query;
    const filter: any = {};

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      this.authorModel
        .find(filter)
        .populate('bookCount')
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

    const data = this.authorMapper.toResponseDtoArray(authors);

    return new PaginatedResponseDto(data, meta);
  }

  async findOne(id: string): Promise<AuthorResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const author = await this.authorModel
        .findById(id)
        .populate('bookCount')
        .exec();

      if (!author) {
        throw new NotFoundException(`Author with ID ${id} not found`);
      }

      return this.authorMapper.toResponseDto(author);
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

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deletedAuthor = await this.authorModel.findByIdAndDelete(id).exec();

    if (!deletedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }

  async exists(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const count = await this.authorModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  // Method to get authors with their books
  async findWithBooks(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const author = await this.authorModel
      .findById(id)
      .populate('books')
      .populate('bookCount')
      .exec();

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }
}
