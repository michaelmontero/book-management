"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onAddAuthor: () => void
}

export function FloatingActionButton({ onAddAuthor }: FloatingActionButtonProps) {
  return (
    <div className="lg:hidden fixed bottom-4 right-4 z-30">
      <Button
        onClick={onAddAuthor}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg h-12 w-12 sm:h-14 sm:w-14 p-0"
      >
        <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  )
}
