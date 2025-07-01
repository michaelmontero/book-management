import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseCreateBookDto } from '##modules/book/dto/base-create-book.dto';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'Author first name',
    example: 'Gabriel',
  })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Author last name',
    example: 'García Márquez',
  })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'Author email address',
    example: 'gabriel@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Author photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    description: 'Author biography',
    example: 'Colombian novelist and Nobel Prize winner...',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiProperty({
    description: 'Author country',
    example: 'Colombia',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({
    description: 'Social media links',
    example: ['https://twitter.com/author'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialMedia?: string[];

  @ApiProperty({
    description: 'Initial books to create with the author',
    type: [BaseCreateBookDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseCreateBookDto)
  books?: BaseCreateBookDto[];
}
