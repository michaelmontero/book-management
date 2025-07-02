import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/types/library';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
        {book.title}
      </h5>

      <div className="space-y-2 text-xs sm:text-sm text-gray-600">
        <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate">
          {book.isbn}
        </p>

        <div className="flex flex-wrap gap-1">
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          {book.publishedDate && (
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(book.publishedDate).getFullYear()}
            </span>
          )}
          {book.pages && <span>{book.pages}p</span>}
        </div>
      </div>
    </div>
  );
}
