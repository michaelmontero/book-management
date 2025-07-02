import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { BaseCreateBookDto } from './base-create-book.dto';

export class CreateBookDto extends BaseCreateBookDto {
  @ApiProperty({
    description: 'Author ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Author ID is required' })
  @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
  authorId: string;
}
