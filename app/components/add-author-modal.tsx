'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, X, BookOpen } from 'lucide-react';
import { ISBNInput } from './isbn-input';
import { PhotoPreview } from './photo-preview'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { validateISBN } from '@/utils/isbn-validator';

interface BookFormData {
  id: string;
  title: string;
  isbn: string;
  genre: string;
  publishedDate: string;
  pages: string
}

interface AuthorFormData {
  firstName: string
  lastName: string
  email: string
  country: string
  bio: string
  photo: string
  books: BookFormData[]
}

interface BookSubmissionData {
  title: string
  isbn: string
  genre?: string
  publishedDate?: string
  pages?: number
}

interface AuthorSubmissionData {
  firstName: string
  lastName: string
  email: string
  country?: string
  bio?: string
  photo?: string
  books?: BookSubmissionData[]
}

interface FormContentProps {
  formData: AuthorFormData
  setFormData: React.Dispatch<React.SetStateAction<AuthorFormData>>
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  isMobile: boolean
}

// Move FormContent outside to prevent recreation
function FormContent({ formData, setFormData, onSubmit, onClose, isMobile }: FormContentProps) {
  const addBook = () => {
    const newBook: BookFormData = {
      id: Date.now().toString(),
      title: '',
      isbn: '',
      genre: '',
      publishedDate: '',
      pages: '',
    }
    setFormData((prev) => ({
      ...prev,
      books: [...prev.books, newBook],
    }))
  }

  const removeBook = (bookId: string) => {
    setFormData((prev) => ({
      ...prev,
      books: prev.books.filter((book) => book.id !== bookId),
    }))
  }

  const updateBook = (bookId: string, field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      books: prev.books.map((book) => (book.id === bookId ? { ...book, [field]: value } : book)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all ISBNs before submitting
    const invalidBooks = formData.books.filter((book) => {
      if (!book.title.trim() || !book.isbn.trim()) return true
      const validation = validateISBN(book.isbn)
      return !validation.isValid
    })

    if (invalidBooks.length > 0) {
      alert('Please fix all ISBN validation errors before submitting.')
      return
    }

    onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 px-4 sm:px-0'>
      {/* Author Information Section */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold text-gray-900'>Author Information</h3>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='firstName' className='text-sm font-medium'>
              First Name *
            </Label>
            <Input
              id='firstName'
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              required
              placeholder='Gabriel'
              className='h-11'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lastName' className='text-sm font-medium'>
              Last Name *
            </Label>
            <Input
              id='lastName'
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              required
              placeholder='García Márquez'
              className='h-11'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium'>
            Email *
          </Label>
          <Input
            id='email'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
            placeholder='gabriel@example.com'
            className='h-11'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='photo' className='text-sm font-medium'>
            Photo URL
          </Label>
          <Input
            id='photo'
            type='url'
            value={formData.photo}
            onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
            placeholder='https://example.com/photo.jpg'
            className='h-11'
          />
          <p className='text-xs text-gray-500'>Optional: Add a URL to the authors photo</p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='country' className='text-sm font-medium'>
            Country
          </Label>
          <Input
            id='country'
            value={formData.country}
            onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
            placeholder='Colombia'
            className='h-11'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio' className='text-sm font-medium'>
            Biography
          </Label>
          <Textarea
            id='bio'
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder='Brief biography of the author...'
            rows={3}
            className='resize-none'
          />
        </div>
      </div>

      {/* Photo Preview */}
      {(formData.firstName || formData.lastName || formData.photo) && (
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-gray-700'>Preview</Label>
          <PhotoPreview
            photo={formData.photo}
            firstName={formData.firstName}
            lastName={formData.lastName}
            className='py-2'
          />
        </div>
      )}

      <Separator />

      {/* Books Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-blue-600' />
            <h3 className='text-lg font-semibold text-gray-900'>Books (Optional)</h3>
          </div>
          <Button
            type='button'
            onClick={addBook}
            size='sm'
            variant='outline'
            className='flex items-center gap-2 bg-transparent'
          >
            <Plus className='h-4 w-4' />
            Add Book
          </Button>
        </div>

        {formData.books.length === 0 ? (
          <div className='text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
            <BookOpen className='h-8 w-8 text-gray-400 mx-auto mb-2' />
            <p className='text-sm text-gray-500 mb-3'>No books added yet</p>
            <Button type='button' onClick={addBook} size='sm' variant='outline' className='text-xs bg-transparent'>
              <Plus className='h-3 w-3 mr-1' />
              Add First Book
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.books.map((book, index) => (
              <div key={book.id} className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-medium text-gray-900'>Book #{index + 1}</h4>
                  <Button
                    type='button'
                    onClick={() => removeBook(book.id)}
                    size='sm'
                    variant='ghost'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>

                <div className='space-y-3'>
                  <div className='grid grid-cols-1 gap-3'>
                    <div className='space-y-1'>
                      <Label className='text-xs font-medium text-gray-700'>Title *</Label>
                      <Input
                        value={book.title}
                        onChange={(e) => updateBook(book.id, 'title', e.target.value)}
                        required
                        placeholder='One Hundred Years of Solitude'
                        className='h-9 text-sm'
                      />
                    </div>

                    <ISBNInput
                      value={book.isbn}
                      onChange={(value) => updateBook(book.id, 'isbn', value)}
                      required
                      className='h-9 text-sm'
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <div className='space-y-1'>
                      <Label className='text-xs font-medium text-gray-700'>Genre</Label>
                      <Input
                        value={book.genre}
                        onChange={(e) => updateBook(book.id, 'genre', e.target.value)}
                        placeholder='Magical Realism'
                        className='h-9 text-sm'
                      />
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs font-medium text-gray-700'>Published Date</Label>
                      <Input
                        type='date'
                        value={book.publishedDate}
                        onChange={(e) => updateBook(book.id, 'publishedDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className='h-9 text-sm'
                      />
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs font-medium text-gray-700'>Pages</Label>
                      <Input
                        type='number'
                        value={book.pages}
                        onChange={(e) => updateBook(book.id, 'pages', e.target.value)}
                        placeholder='417'
                        className='h-9 text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMobile ? (
        <DrawerFooter className='px-0 pt-6'>
          <Button
            type='submit'
            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11'
          >
            Create Author{' '}
            {formData.books.length > 0 && `& ${formData.books.length} Book${formData.books.length > 1 ? 's' : ''}`}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline' onClick={onClose} className='h-11 bg-transparent'>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      ) : (
        <DialogFooter className='pt-6'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          >
            Create Author{' '}
            {formData.books.length > 0 && `& ${formData.books.length} Book${formData.books.length > 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      )}
    </form>
  )
}

interface AddAuthorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (author: AuthorSubmissionData) => void
}

export function AddAuthorModal({ isOpen, onClose, onSubmit }: AddAuthorModalProps) {
  const [formData, setFormData] = useState<AuthorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    bio: '',
    photo: '',
    books: [],
  })

  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that all books have required fields and valid ISBNs
    const hasInvalidBooks = formData.books.some((book) => {
      if (!book.title.trim() || !book.isbn.trim()) return true
      const validation = validateISBN(book.isbn)
      return !validation.isValid
    })

    if (hasInvalidBooks) {
      alert('Please fill in all required book fields with valid ISBNs or remove incomplete books.')
      return
    }

    const booksData: BookSubmissionData[] = formData.books.map((book) => ({
      title: book.title,
      isbn: book.isbn.replace(/[-\s]/g, ''), // Clean ISBN for backend
      genre: book.genre || undefined,
      publishedDate: book.publishedDate || undefined,
      pages: book.pages ? Number.parseInt(book.pages) : undefined,
    }))

    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country || undefined,
      bio: formData.bio || undefined,
      photo: formData.photo || undefined,
      books: booksData.length > 0 ? booksData : undefined,
    })

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      bio: '',
      photo: '',
      books: [],
    })
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      bio: '',
      photo: '',
      books: [],
    })
    onClose()
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent className='max-h-[95vh]'>
          <DrawerHeader className='text-left'>
            <DrawerTitle className='text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Add New Author
            </DrawerTitle>
            <DrawerDescription>
              Add a new author to your library. You can also add their books at the same time.
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto flex-1'>
            <FormContent
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onClose={handleClose}
              isMobile={isMobile}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Add New Author
          </DialogTitle>
          <DialogDescription>
            Add a new author to your library. You can also add their books at the same time.
          </DialogDescription>
        </DialogHeader>
        <FormContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  )
}
