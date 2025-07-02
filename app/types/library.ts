export interface Book {
  id: string;
  title: string;
  isbn: string;
  genre?: string;
  publishedDate?: string;
  pages?: number;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  photo?: string;
  bio?: string;
  books: Book[];
}

export interface AuthorWithBooks {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  bio?: string;
  books?: {
    title: string;
    isbn: string;
    genre?: string;
    publishedDate?: string;
    pages?: number;
  }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
