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