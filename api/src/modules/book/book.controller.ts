import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { QueryBookDto } from './dto/query-book.dto';
import {
  createPaginatedResponseDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';

const PaginatedBooksResponseDto = createPaginatedResponseDto(BookResponseDto);

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new book',
    description: 'Creates a new book with the provided information',
  })
  @ApiBody({
    type: CreateBookDto,
    description: 'Book data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Book with this ISBN already exists',
  })
  async create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books with pagination and filtering',
    description:
      'Retrieves a paginated list of books with optional search and filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for title, description, genre, or publisher',
    example: 'Solitude',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    type: String,
    description: 'Filter by author ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: 'Filter by genre',
    example: 'Magical Realism',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    type: Boolean,
    description: 'Filter by availability',
    example: true,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['title', 'publishedDate', 'createdAt', 'updatedAt', 'price'],
    description: 'Sort field (default: createdAt)',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of books retrieved successfully',
    type: PaginatedBooksResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters',
  })
  async findAll(
    @Query() query: QueryBookDto,
  ): Promise<PaginatedResponseDto<BookResponseDto>> {
    return this.bookService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book by ID',
    description: 'Retrieves a single book by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Book unique identifier (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Book retrieved successfully',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.bookService.findOne(id);
  }
}
