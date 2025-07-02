import { Users, BookOpen, Hash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Author } from "@/types/library"

interface StatsCardsProps {
  authors: Author[]
}

export function StatsCards({ authors }: StatsCardsProps) {
  const totalBooks = authors.reduce((sum, author) => sum + author.books.length, 0)
  const avgBooks = authors.length > 0 ? Math.round((totalBooks / authors.length) * 10) / 10 : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Authors</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{authors.length}</p>
            </div>
            <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">Books</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{totalBooks}</p>
            </div>
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 col-span-2 lg:col-span-1">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">Avg Books</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{avgBooks}</p>
            </div>
            <Hash className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
