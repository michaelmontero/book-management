import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'First name of the author',
    example: 'Gabriel',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'García Márquez',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({
    description: 'Email address of the author',
    example: 'gabriel@example.com',
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Profile photo URL',
    example: 'https://example.com/photos/gabriel-garcia-marquez.jpg',
    required: false,
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid photo URL' })
  @Transform(({ value }) => value?.trim())
  photo?: string;

  @ApiProperty({
    description: 'Biography or description of the author',
    example:
      'Colombian novelist, short-story writer, screenwriter, and journalist, known for his magical realism.',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(2000, { message: 'Bio must not exceed 2000 characters' })
  @Transform(({ value }) => value?.trim())
  bio?: string;

  @ApiProperty({
    description: 'Country of origin',
    example: 'Colombia',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @MaxLength(50, { message: 'Country must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @ApiProperty({
    description: 'Website URL of the author',
    example: 'https://www.gabrielgarciamarquez.com',
    required: false,
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  @Transform(({ value }) => value?.trim())
  website?: string;

  @ApiProperty({
    description: 'Social media handles or links',
    example: [
      '@gabriel_gm',
      'https://twitter.com/gabriel_gm',
      'https://instagram.com/gabriel_gm',
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Social media must be an array' })
  @IsString({ each: true, message: 'Each social media entry must be a string' })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => v?.trim()).filter(Boolean) : [],
  )
  socialMedia?: string[];

  @ApiProperty({
    description: 'Awards and recognitions received',
    example: [
      'Nobel Prize in Literature (1982)',
      'Neustadt International Prize for Literature (1972)',
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Awards must be an array' })
  @IsString({ each: true, message: 'Each award must be a string' })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => v?.trim()).filter(Boolean) : [],
  )
  awards?: string[];

  @ApiProperty({
    description: 'Agent or publisher contact information',
    example: 'Literary Agency XYZ - contact@literaryxyz.com',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Agent contact must be a string' })
  @MaxLength(200, { message: 'Agent contact must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  agentContact?: string;
}
