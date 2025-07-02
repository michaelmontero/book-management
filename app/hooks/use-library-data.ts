'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Author,
  AuthorWithBooks,
  Book,
  PaginatedResponse,
} from '@/types/library';
import { useWebSocket } from './use-websocket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UseLibraryDataOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useLibraryData(options: UseLibraryDataOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchAuthors = useCallback(
    async (
      page: number = currentPage,
      pageLimit: number = limit,
      append = false,
    ) => {
      try {
        setError(null);
        if (!append) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: pageLimit.toString(),
        });

        const response = await fetch(`${API_URL}/authors?${searchParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const result: PaginatedResponse<Author> = await response.json();

        if (append) {
          setAuthors((prev) => [...prev, ...result.data]);
        } else {
          setAuthors(result.data);
        }

        setMeta({
          total: result.meta.total,
          totalPages: result.meta.totalPages,
          hasNextPage: result.meta.hasNextPage,
          hasPrevPage: result.meta.hasPrevPage,
        });

        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to fetch authors:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch authors',
        );
        if (!append) {
          setAuthors([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentPage, limit],
  );

  // Load more authors (for infinite scroll or "Load More" button)
  const loadMoreAuthors = useCallback(async () => {
    if (meta.hasNextPage && !loadingMore) {
      await fetchAuthors(currentPage + 1, limit, true);
    }
  }, [fetchAuthors, currentPage, limit, meta.hasNextPage, loadingMore]);

  // Go to specific page (for traditional pagination)
  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= meta.totalPages && page !== currentPage) {
        await fetchAuthors(page, limit, false);
      }
    },
    [fetchAuthors, limit, meta.totalPages, currentPage],
  );

  // Change page size
  const changePageSize = useCallback(
    async (newLimit: number) => {
      setLimit(newLimit);
      await fetchAuthors(1, newLimit, false);
    },
    [fetchAuthors],
  );

  // Refresh current page
  const refreshCurrentPage = useCallback(async () => {
    await fetchAuthors(currentPage, limit, false);
  }, [fetchAuthors, currentPage, limit]);

  // WebSocket event handlers
  const handleAuthorCreated = useCallback((newAuthor: Author) => {
    setAuthors((prev) => [newAuthor, ...prev]);
    setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
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
    refreshCurrentPage();
  }, [refreshCurrentPage]);

  const { isConnected, connectionError } = useWebSocket({
    onAuthorCreated: handleAuthorCreated,
    onBookCreated: handleBookCreated,
    onLibraryUpdated: handleLibraryUpdated,
  });

  useEffect(() => {
    fetchAuthors(1, limit, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Data
    authors,
    loading,
    loadingMore,
    error,
    isConnected,
    connectionError,

    currentPage,
    limit,
    totalAuthors: meta.total,
    totalPages: meta.totalPages,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,

    // Actions
    handleAddAuthor,
    handleAddBook,
    loadMoreAuthors,
    goToPage,
    changePageSize,
    refetch: refreshCurrentPage,
  };
}
