'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Author, AuthorWithBooks, Book } from '@/types/library';
import { useWebSocket } from './use-websocket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useLibraryData() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/authors`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      setAuthors(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch authors',
      );
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket event handlers
  const handleAuthorCreated = useCallback((newAuthor: Author) => {
    setAuthors((prev) => [...prev, newAuthor]);
  }, []);

  const handleBookCreated = useCallback((newBook: Book, authorId: string) => {
    setAuthors((prev) =>
      prev.map((author) =>
        author.id === authorId
          ? { ...author, books: [...author.books, newBook] }
          : author,
      ),
    );
  }, []);

  const handleLibraryUpdated = useCallback(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Initialize WebSocket
  const { isConnected, connectionError } = useWebSocket({
    onAuthorCreated: handleAuthorCreated,
    onBookCreated: handleBookCreated,
    onLibraryUpdated: handleLibraryUpdated,
  });

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleAddAuthor = async (authorData: AuthorWithBooks) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to add author:', error);
      setError(error instanceof Error ? error.message : 'Failed to add author');
      return false;
    }
  };

  const handleAddBook = async (
    bookData: Omit<Book, 'id'> & { authorId: string },
  ) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to add book:', error);
      setError(error instanceof Error ? error.message : 'Failed to add book');
      return false;
    }
  };

  return {
    authors,
    loading,
    error,
    isConnected,
    connectionError,
    handleAddAuthor,
    handleAddBook,
    refetch: fetchAuthors,
  };
}
