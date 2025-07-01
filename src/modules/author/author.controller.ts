import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';

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
}
