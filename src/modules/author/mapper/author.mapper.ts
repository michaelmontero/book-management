import { Injectable } from '@nestjs/common';
import type { CreateAuthorDto } from '../dto/create-author.dto';
import type { AuthorResponseDto } from '../dto/author-response.dto';
import { Author, AuthorDocument } from '../schema/author.schema';

@Injectable()
export class AuthorMapper {
  toEntity(createAuthorDto: CreateAuthorDto): Partial<Author> {
    return {
      firstName: createAuthorDto.firstName?.trim(),
      lastName: createAuthorDto.lastName?.trim(),
      email: createAuthorDto.email?.trim().toLowerCase(),
      photo: createAuthorDto.photo?.trim() || undefined,
      bio: createAuthorDto.bio?.trim() || undefined,
      country: createAuthorDto.country?.trim() || undefined,
      socialMedia: createAuthorDto.socialMedia || [],
    };
  }

  toResponseDto(authorDocument: AuthorDocument): AuthorResponseDto {
    if (!authorDocument) {
      throw new Error('AuthorDocument is required for mapping');
    }

    try {
      const responseDto = {
        id: authorDocument._id?.toString() || authorDocument.id,
        firstName: authorDocument.firstName,
        lastName: authorDocument.lastName,
        fullName: `${authorDocument.firstName} ${authorDocument.lastName}`,
        email: authorDocument.email,
        photo: authorDocument.photo,
        bio: authorDocument.bio,
        country: authorDocument.country,
        socialMedia: authorDocument.socialMedia || [],
        bookCount: (authorDocument as any).bookCount || 0,
        createdAt: authorDocument.createdAt,
        updatedAt: authorDocument.updatedAt,
      } as AuthorResponseDto;

      return responseDto;
    } catch (error) {
      throw new Error(
        `Error mapping AuthorDocument to ResponseDto: ${error.message}`,
      );
    }
  }

  toResponseDtoArray(authorDocuments: AuthorDocument[]): AuthorResponseDto[] {
    if (!Array.isArray(authorDocuments)) {
      return [];
    }

    return authorDocuments.map((doc) => this.toResponseDto(doc));
  }

  hasChanges(updateData: Partial<Author>): boolean {
    return Object.keys(updateData).length > 0;
  }
}
