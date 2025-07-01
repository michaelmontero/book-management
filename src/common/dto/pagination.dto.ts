import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 50,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

export function createPaginatedResponseDto<T>(classRef: new () => T) {
  class PaginatedResponse extends PaginatedResponseDto<T> {
    @ApiProperty({
      type: [classRef],
      description: 'Array of items for the current page',
    })
    data: T[];
  }

  return PaginatedResponse;
}
