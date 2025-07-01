import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorMapper } from './mapper/author.mapper';
import { Author, AuthorDocument } from './schema/author.schema';
import { AuthorResponseDto } from './dto/author-response.dto';

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
}
