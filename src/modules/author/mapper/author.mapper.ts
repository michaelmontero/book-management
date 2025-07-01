import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { Author, AuthorDocument } from '../schema/author.schema';
import { AuthorResponseDto } from '../dto/author-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthorMapper {
  /**
   * Maps CreateAuthorDto to Author entity for database insertion
   */
  toEntity(createAuthorDto: CreateAuthorDto): Partial<Author> {
    return {
      firstName: createAuthorDto.firstName?.trim(),
      lastName: createAuthorDto.lastName?.trim(),
      email: createAuthorDto.email?.toLowerCase().trim(),
      photo: createAuthorDto.photo?.trim() || undefined,
      bio: createAuthorDto.bio?.trim() || undefined,
      country: createAuthorDto.country?.trim() || undefined,
      website: createAuthorDto.website?.trim() || undefined,
      socialMedia: this.cleanStringArray(createAuthorDto.socialMedia),
      awards: this.cleanStringArray(createAuthorDto.awards),
      agentContact: createAuthorDto.agentContact?.trim() || undefined,
    };
  }

  /**
   * Maps AuthorDocument to AuthorResponseDto for API response
   */
  toResponseDto(authorDocument: AuthorDocument): AuthorResponseDto {
    const responseDto = plainToClass(AuthorResponseDto, {
      id: authorDocument._id?.toString(),
      firstName: authorDocument.firstName,
      lastName: authorDocument.lastName,
      fullName: `${authorDocument.firstName} ${authorDocument.lastName}`,
      email: authorDocument.email,
      photo: authorDocument.photo,
      bio: authorDocument.bio,
      country: authorDocument.country,
      website: authorDocument.website,
      socialMedia: authorDocument.socialMedia || [],
      awards: authorDocument.awards || [],
      agentContact: authorDocument.agentContact,
      booksCount: authorDocument.booksCount || 0,
      createdAt: authorDocument.createdAt,
      updatedAt: authorDocument.updatedAt,
    });

    return responseDto;
  }

  /**
   * Maps array of AuthorDocuments to array of AuthorResponseDtos
   */
  toResponseDtoArray(authorDocuments: AuthorDocument[]): AuthorResponseDto[] {
    if (!Array.isArray(authorDocuments)) {
      return [];
    }

    return authorDocuments?.map(this.toResponseDto);
  }

  /**
   * Helper method to clean and filter string arrays
   */
  private cleanStringArray(array?: string[]): string[] {
    if (!Array.isArray(array)) {
      return [];
    }

    return array
      .map((item) => item?.trim())
      .filter((item) => item && item.length > 0);
  }
}
