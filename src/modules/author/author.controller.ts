import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';
import {
  createPaginatedResponseDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';
import { QueryAuthorDto } from './dto/query-author.dto';

const PaginatedAuthorsResponseDto =
  createPaginatedResponseDto(AuthorResponseDto);

@ApiTags('authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new author',
    description: 'Creates a new author with the provided information',
  })
  @ApiBody({
    type: CreateAuthorDto,
    description: 'Author data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Author created successfully',
    type: AuthorResponseDto,
  })
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorResponseDto> {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors with pagination',
    description: 'Retrieves a paginated list of authors',
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
  @ApiResponse({
    status: 200,
    description: 'Paginated list of authors retrieved successfully',
    type: PaginatedAuthorsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters',
  })
  async findAll(
    @Query() query: QueryAuthorDto,
  ): Promise<PaginatedResponseDto<AuthorResponseDto>> {
    return this.authorService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get author by ID',
    description: 'Retrieves a single author by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Author unique identifier (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Author retrieved successfully',
    type: AuthorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  async findOne(@Param('id') id: string): Promise<AuthorResponseDto> {
    return this.authorService.findOne(id);
  }
}
