import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    private readonly authorMapper: AuthorMapper,
  ) {
    this.authorModel = authorModel;
    this.authorMapper = authorMapper;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      const authorData = this.authorMapper.toEntity(createAuthorDto);
      const createdAuthor = new this.authorModel(authorData);
      const savedAuthor = await createdAuthor.save();

      // Populate bookCount for response
      const populatedAuthor = await this.authorModel
        .findById(savedAuthor._id)
        .populate('bookCount')
        .exec();

      return this.authorMapper.toResponseDto(populatedAuthor);
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
