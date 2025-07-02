'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  totalLoaded: number;
  totalAvailable: number;
}

export function LoadMoreButton({
  hasMore,
  loading,
  onLoadMore,
  totalLoaded,
  totalAvailable,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          Showing all {totalAvailable} author{totalAvailable !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <Button
        onClick={onLoadMore}
        disabled={loading}
        variant="outline"
        className="bg-white hover:bg-gray-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading more...
          </>
        ) : (
          <>
            Load More Authors ({totalLoaded} of {totalAvailable})
          </>
        )}
      </Button>
    </div>
  );
}
