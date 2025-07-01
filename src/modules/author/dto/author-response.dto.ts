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
    description: 'First name of the author',
    example: 'Gabriel',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'García Márquez',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Full name of the author',
    example: 'Gabriel García Márquez',
  })
  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @ApiProperty({
    description: 'Email address of the author',
    example: 'gabriel@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Profile photo URL',
    example: 'https://example.com/photos/gabriel-garcia-marquez.jpg',
    required: false,
  })
  @Expose()
  photo?: string;

  @ApiProperty({
    description: 'Biography or description of the author',
    example: 'Colombian novelist and Nobel Prize winner',
    required: false,
  })
  @Expose()
  bio?: string;

  @ApiProperty({
    description: 'Country of origin',
    example: 'Colombia',
    required: false,
  })
  @Expose()
  country?: string;

  @ApiProperty({
    description: 'Website URL of the author',
    example: 'https://www.gabrielgarciamarquez.com',
    required: false,
  })
  @Expose()
  website?: string;

  @ApiProperty({
    description: 'Social media handles or links',
    example: ['@gabriel_gm', 'https://twitter.com/gabriel_gm'],
    required: false,
  })
  @Expose()
  socialMedia?: string[];

  @ApiProperty({
    description: 'Awards and recognitions received',
    example: ['Nobel Prize in Literature (1982)'],
    required: false,
  })
  @Expose()
  awards?: string[];

  @ApiProperty({
    description: 'Agent or publisher contact information',
    example: 'Literary Agency XYZ - contact@literaryxyz.com',
    required: false,
  })
  @Expose()
  agentContact?: string;

  @ApiProperty({
    description: 'Number of books by this author',
    example: 15,
  })
  @Expose()
  booksCount?: number;

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
