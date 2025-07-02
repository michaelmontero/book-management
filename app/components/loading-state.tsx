import { BookOpen } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 animate-pulse mx-auto mb-4" />
        <p className="text-gray-600 text-sm sm:text-base">
          Loading your library...
        </p>
      </div>
    </div>
  );
}
