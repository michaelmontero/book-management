/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useLibraryData } from '@/hooks/use-library-data';
import { LibraryHeader } from '@/components/library-header';
import { AuthorCard } from '@/components/author-card';
import { EmptyState } from '@/components/empty-state';
import { LoadingState } from '@/components/loading-state';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddAuthorModal } from '@/components/add-author-modal';
import { AddBookModal } from '@/components/add-book-modal';
import { LoadMoreButton } from '@/components/load-more-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Users, BookOpen } from 'lucide-react';

export default function LibraryManagement() {
  const {
    authors,
    loading,
    loadingMore,
    error,
    connectionError,
    currentPage,
    totalAuthors,
    hasNextPage,
    handleAddAuthor,
    handleAddBook,
    loadMoreAuthors,
    refetch,
  } = useLibraryData({ initialLimit: 10 });

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');

  const filteredAuthors = authors.filter(
    (author) =>
      `${author.firstName} ${author.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      author.books.some((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const onAddAuthor = async (authorData: any) => {
    const success = await handleAddAuthor(authorData);
    if (success) {
      setIsAddAuthorOpen(false);
    }
  };

  const onAddBook = async (bookData: any) => {
    const success = await handleAddBook(bookData);
    if (success) {
      setIsAddBookOpen(false);
    }
  };

  const openAddBookModal = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setIsAddBookOpen(true);
  };

  if (loading && authors.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <LibraryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddAuthor={() => setIsAddAuthorOpen(true)}
      />

      <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Connection Status & Stats */}
        <div className="mb-6 space-y-4">
          {/* Library Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Total Authors
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalAuthors}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Total Books
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {authors.reduce(
                      (sum, author) => sum + author.books.length,
                      0,
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">
                    Current Page
                  </span>
                  <p className="text-2xl font-bold text-green-600">
                    {currentPage}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">
                    Showing
                  </span>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredAuthors.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-red-800">Error loading data: {error}</span>
              <Button
                onClick={refetch}
                size="sm"
                variant="outline"
                className="ml-4 border-red-200 text-red-800 hover:bg-red-100 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {connectionError && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              WebSocket connection error: {connectionError}. Real-time updates
              may not work.
            </AlertDescription>
          </Alert>
        )}

        <FloatingActionButton onAddAuthor={() => setIsAddAuthorOpen(true)} />

        {/* Authors List */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {filteredAuthors.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              onAddAuthor={() => setIsAddAuthorOpen(true)}
            />
          ) : (
            <>
              {filteredAuthors.map((author) => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  onAddBook={openAddBookModal}
                />
              ))}

              <LoadMoreButton
                hasMore={hasNextPage}
                loading={loadingMore}
                onLoadMore={loadMoreAuthors}
                totalLoaded={authors.length}
                totalAvailable={totalAuthors}
              />
            </>
          )}
        </div>

        <div className="lg:hidden h-16" />
      </div>

      <AddAuthorModal
        isOpen={isAddAuthorOpen}
        onClose={() => setIsAddAuthorOpen(false)}
        onSubmit={onAddAuthor}
      />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onSubmit={onAddBook}
        authors={authors}
        selectedAuthorId={selectedAuthorId}
      />
    </div>
  );
}
