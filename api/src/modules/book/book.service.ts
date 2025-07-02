import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { BookMapper } from './mapper/book.mapper';
import { Book, BookDocument } from './schema/book.schema';
import { AuthorService } from '##modules/author/author.service';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from 'src/common/dto/pagination.dto';
import { WebsocketService } from '##modules/websocket/websocket.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly authorService: AuthorService,
    private readonly websocketService: WebsocketService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    try {
      // Validate that author exists
      await this.validateAuthorExists(createBookDto.authorId);

      const bookData = BookMapper.toEntity(createBookDto);
      const createdBook = new this.bookModel(bookData);
      const savedBook = await createdBook.save();

      // Populate author data for response
      const populatedBook = await this.bookModel
        .findById(savedBook._id)
        .populate('author')
        .exec();

      const response = BookMapper.toResponseDto(populatedBook);
      this.websocketService.emitBookCreated(response, createBookDto.authorId);
      return response;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Book with this ISBN already exists');
      }
      throw error;
    }
  }

  async findAllPaginated(
    query: QueryBookDto,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      authorId,
      genre,
      available,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { publisher: { $regex: search, $options: 'i' } },
      ];
    }

    if (authorId) {
      if (!isValidObjectId(authorId)) {
        throw new BadRequestException('Invalid author ID format');
      }
      filter.authorId = new Types.ObjectId(authorId);
    }

    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    if (available !== undefined) {
      filter.available = available;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [books, total] = await Promise.all([
      this.bookModel
        .find(filter)
        .populate('author')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(filter).exec(),
    ]);

    // Calculate pagination info
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

    const data = BookMapper.toResponseDtoArray(books);

    return new PaginatedResponseDto(data, meta);
  }

  async findOne(id: string): Promise<BookResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const book = await this.bookModel.findById(id).populate('author').exec();

      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return BookMapper.toResponseDto(book);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving book: ${error.message}`);
    }
  }

  async findByAuthor(authorId: string): Promise<BookResponseDto[]> {
    if (!isValidObjectId(authorId)) {
      throw new BadRequestException('Invalid author ID format');
    }

    const books = await this.bookModel
      .find({ authorId: new Types.ObjectId(authorId) })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();

    return BookMapper.toResponseDtoArray(books);
  }

  async findByISBN(isbn: string): Promise<BookResponseDto | null> {
    const book = await this.bookModel
      .findOne({ isbn: isbn.replace(/[-\s]/g, '') })
      .populate('author')
      .exec();

    return book ? BookMapper.toResponseDto(book) : null;
  }

  async exists(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const count = await this.bookModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  private async validateAuthorExists(authorId: string): Promise<void> {
    if (!isValidObjectId(authorId)) {
      throw new BadRequestException('Invalid author ID format');
    }

    const authorExists = await this.authorService.exists(authorId);
    if (!authorExists) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }
  }
}
