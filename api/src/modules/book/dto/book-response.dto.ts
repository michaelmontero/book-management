import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class BookAuthorDto {
  @ApiProperty({
    description: 'Author ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Author first name',
    example: 'Gabriel',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Author last name',
    example: 'García Márquez',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Author full name',
    example: 'Gabriel García Márquez',
  })
  @Expose()
  fullName: string;
}

export class BookResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the book',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({
    description: 'Title of the book',
    example: 'One Hundred Years of Solitude',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'ISBN of the book',
    example: '978-0060883287',
  })
  @Expose()
  isbn: string;

  @ApiProperty({
    description: 'Author ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj.authorId?.toString())
  authorId: string;

  @ApiProperty({
    description: 'Author details',
    type: BookAuthorDto,
    required: false,
  })
  @Expose()
  author?: BookAuthorDto;

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1967-06-05T00:00:00.000Z',
    required: false,
  })
  @Expose()
  publishedDate?: Date;

  @ApiProperty({
    description: 'Genre of the book',
    example: 'Magical Realism',
    required: false,
  })
  @Expose()
  genre?: string;

  @ApiProperty({
    description: 'Description or synopsis of the book',
    example: 'A multi-generational saga of the Buendía family...',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Number of pages',
    example: 417,
    required: false,
  })
  @Expose()
  pages?: number;

  @ApiProperty({
    description: 'Language of the book',
    example: 'Spanish',
    required: false,
  })
  @Expose()
  language?: string;

  @ApiProperty({
    description: 'Publisher of the book',
    example: 'Harper & Row',
    required: false,
  })
  @Expose()
  publisher?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/covers/one-hundred-years.jpg',
    required: false,
  })
  @Expose()
  coverImage?: string;

  @ApiProperty({
    description: 'Price of the book',
    example: 15.99,
    required: false,
  })
  @Expose()
  price?: number;

  @ApiProperty({
    description: 'Whether the book is available',
    example: true,
  })
  @Expose()
  available: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-07T10:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-07T10:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
