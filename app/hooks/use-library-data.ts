"use client"

import { useState, useEffect } from "react"
import type { Author, Book } from "@/types/library"

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001"
export function useLibraryData() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_HOST}/authors`)
      const data = await response.json()
      setAuthors(data?.data || [])
    } catch (error) {
      console.error("Failed to fetch authors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAuthor = async (authorData: Omit<Author, "id" | "books">) => {
    try {
      const response = await fetch(`${API_HOST}/authors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorData),
      })

      if (response.ok) {
        await fetchAuthors()
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to add author:", error)
      return false
    }
  }

  const handleAddBook = async (bookData: Omit<Book, "id"> & { authorId: string }) => {
    try {
      const response = await fetch(`${API_HOST}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        await fetchAuthors()
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to add book:", error)
      return false
    }
  }

  return {
    authors,
    loading,
    handleAddAuthor,
    handleAddBook,
  }
}
