import { BookResponseDto } from '##modules/book/dto/book-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class AuthorResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the author',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
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

  @ApiProperty({
    description: 'Author email address',
    example: 'gabriel@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Author photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @Expose()
  photo?: string;

  @ApiProperty({
    description: 'Author biography',
    example: 'Colombian novelist and Nobel Prize winner...',
    required: false,
  })
  @Expose()
  bio?: string;

  @ApiProperty({
    description: 'Author country',
    example: 'Colombia',
    required: false,
  })
  @Expose()
  country?: string;

  @ApiProperty({
    description: 'Social media links',
    example: ['https://twitter.com/author'],
  })
  @Expose()
  socialMedia: string[];

  @ApiProperty({
    description: 'Number of books by this author',
    example: 5,
  })
  @Expose()
  bookCount: number;

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

  @ApiProperty({
    description: 'Books created with the author (if any)',
    type: [BookResponseDto],
    required: false,
  })
  @Expose()
  books?: BookResponseDto[];
}
