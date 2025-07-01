import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorMapper } from './mapper/author.mapper';
import { Author, AuthorDocument } from './schema/author.schema';
import { AuthorResponseDto } from './dto/author-response.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from 'src/common/dto/pagination.dto';
import { QueryAuthorDto } from './dto/query-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    private readonly authorMapper: AuthorMapper,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      const authorData = this.authorMapper.toEntity(createAuthorDto);

      const createdAuthor = new this.authorModel(authorData);
      const savedAuthor = await createdAuthor.save();

      return this.authorMapper.toResponseDto(savedAuthor);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Author with this email already exists');
      }
      throw error;
    }
  }

  async findAllPaginated(
    query: QueryAuthorDto,
  ): Promise<PaginatedResponseDto<AuthorResponseDto>> {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      this.authorModel
        .find()
        .sort({ createdAt: -1 }) // Most recent first
        .skip(skip)
        .limit(limit)
        .exec(),
      this.authorModel.countDocuments().exec(),
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
    console.log('Finding author with ID:', id);

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const objectId = new Types.ObjectId(id);

      const author = await this.authorModel.findById(objectId).exec();
      if (!author) {
        throw new NotFoundException(`Author with ID ${id} not found`);
      }

      return this.authorMapper.toResponseDto(author);
    } catch (error) {
      console.error('Error in findOne:', error);

      // If it's already a known exception, re-throw it
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Handle any other database errors
      throw new BadRequestException(
        `Error retrieving author: ${error.message}`,
      );
    }
  }
}
