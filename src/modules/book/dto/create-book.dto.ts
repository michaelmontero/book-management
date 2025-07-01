import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'One Hundred Years of Solitude',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'ISBN of the book',
    example: '978-0060883287',
    minLength: 10,
    maxLength: 17,
  })
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsString({ message: 'ISBN must be a string' })
  @MinLength(10, { message: 'ISBN must be at least 10 characters long' })
  @MaxLength(17, { message: 'ISBN must not exceed 17 characters' })
  @Transform(({ value }) => value?.trim().replace(/[-\s]/g, ''))
  isbn: string;

  @ApiProperty({
    description: 'Author ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Author ID is required' })
  @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
  authorId: string;

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1967-06-05',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Published date must be a valid date' })
  publishedDate?: string;

  @ApiProperty({
    description: 'Genre of the book',
    example: 'Magical Realism',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  @MaxLength(50, { message: 'Genre must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  genre?: string;

  @ApiProperty({
    description: 'Description or synopsis of the book',
    example: 'A multi-generational saga of the Buendía family...',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Number of pages',
    example: 417,
    required: false,
    minimum: 1,
    maximum: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Pages must be a number' })
  @Min(1, { message: 'Pages must be at least 1' })
  @Max(10000, { message: 'Pages must not exceed 10000' })
  pages?: number;

  @ApiProperty({
    description: 'Language of the book',
    example: 'Spanish',
    required: false,
    maxLength: 30,
  })
  @IsOptional()
  @IsString({ message: 'Language must be a string' })
  @MaxLength(30, { message: 'Language must not exceed 30 characters' })
  @Transform(({ value }) => value?.trim())
  language?: string;

  @ApiProperty({
    description: 'Publisher of the book',
    example: 'Harper & Row',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Publisher must be a string' })
  @MaxLength(100, { message: 'Publisher must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  publisher?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/covers/one-hundred-years.jpg',
    required: false,
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid cover image URL' })
  @Transform(({ value }) => value?.trim())
  coverImage?: string;

  @ApiProperty({
    description: 'Price of the book',
    example: 15.99,
    required: false,
    minimum: 0,
    maximum: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  @Max(10000, { message: 'Price must not exceed 10000' })
  price?: number;

  @ApiProperty({
    description: 'Whether the book is available',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Available must be a boolean' })
  available?: boolean = true;
}
