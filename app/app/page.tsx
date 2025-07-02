'use client';

import { useState } from 'react';
import { useLibraryData } from '@/hooks/use-library-data';
import { LibraryHeader } from '@/components/library-header';
import { StatsCards } from '@/components/stats-cards';
import { AuthorCard } from '@/components/author-card';
import { EmptyState } from '@/components/empty-state';
import { LoadingState } from '@/components/loading-state';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddAuthorModal } from '@/components/add-author-modal';
import { AddBookModal } from '@/components/add-book-modal';

export default function LibraryManagement() {
  const { authors, loading, handleAddAuthor, handleAddBook } = useLibraryData();
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

  if (loading) {
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
        <StatsCards authors={authors} />

        <FloatingActionButton onAddAuthor={() => setIsAddAuthorOpen(true)} />

        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {filteredAuthors.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              onAddAuthor={() => setIsAddAuthorOpen(true)}
            />
          ) : (
            filteredAuthors.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                onAddBook={openAddBookModal}
              />
            ))
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
