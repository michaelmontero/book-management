'use client';

import { Globe, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookCard } from './book-card';
import type { Author } from '@/types/library';

interface AuthorCardProps {
  author: Author;
  onAddBook: (authorId: string) => void;
}

export function AuthorCard({ author, onAddBook }: AuthorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b p-3 sm:p-4 lg:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Author Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                <AvatarFallback className="text-white font-semibold text-sm">
                  {author.firstName[0]}
                  {author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 truncate">
                  {author.firstName} {author.lastName}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm space-y-1">
                  <div className="truncate">{author.email}</div>
                  {author.country && (
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{author.country}</span>
                    </div>
                  )}
                </CardDescription>
              </div>
            </div>

            <Button
              onClick={() => onAddBook(author.id)}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 ml-3 flex-shrink-0 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Add Book</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Bio */}
          {author.bio && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {author.bio}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
            Books ({author.books.length})
          </h4>
        </div>

        {author.books.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs sm:text-sm mb-3">
              No books yet
            </p>
            <Button
              onClick={() => onAddBook(author.id)}
              size="sm"
              variant="outline"
              className="text-xs sm:text-sm"
            >
              Add First Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {author.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
