"use client"

import { BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  searchTerm: string
  onAddAuthor: () => void
}

export function EmptyState({ searchTerm, onAddAuthor }: EmptyStateProps) {
  return (
    <Card className="text-center py-8 sm:py-12">
      <CardContent className="px-4">
        <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No authors found</h3>
        <p className="text-sm text-gray-500 mb-4">
          {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first author."}
        </p>
        {!searchTerm && (
          <Button
            onClick={onAddAuthor}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Author
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
