'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Book } from '@/types/library';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  bio?: string;
  books: Book[];
}

interface FormData {
  title: string;
  isbn: string;
  authorId: string;
  genre: string;
  publishedDate: string;
  pages: string;
}

interface FormContentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  authors: Author[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isMobile: boolean;
}

// Move FormContent outside to prevent recreation
function FormContent({
  formData,
  setFormData,
  authors,
  onSubmit,
  onClose,
  isMobile,
}: FormContentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 px-4 sm:px-0">
      <div className="space-y-2">
        <Label htmlFor="author" className="text-sm font-medium">
          Author *
        </Label>
        <Select
          value={formData.authorId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, authorId: value }))
          }
          required
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select an author" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.firstName} {author.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          placeholder="One Hundred Years of Solitude"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isbn" className="text-sm font-medium">
          ISBN *
        </Label>
        <Input
          id="isbn"
          value={formData.isbn}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isbn: e.target.value }))
          }
          required
          placeholder="978-0060883287"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="genre" className="text-sm font-medium">
            Genre
          </Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, genre: e.target.value }))
            }
            placeholder="Magical Realism"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages" className="text-sm font-medium">
            Pages
          </Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, pages: e.target.value }))
            }
            placeholder="417"
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publishedDate" className="text-sm font-medium">
          Published Date
        </Label>
        <Input
          id="publishedDate"
          type="date"
          value={formData.publishedDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))
          }
          className="h-11"
        />
      </div>

      {isMobile ? (
        <DrawerFooter className="px-0 pt-6">
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-11"
          >
            Add Book
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 bg-transparent"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      ) : (
        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Add Book
          </Button>
        </DialogFooter>
      )}
    </form>
  );
}

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: {
    title: string;
    isbn: string;
    authorId: string;
    genre?: string;
    publishedDate?: string;
    pages?: number;
  }) => void;
  authors: Author[];
  selectedAuthorId?: string;
}

export function AddBookModal({
  isOpen,
  onClose,
  onSubmit,
  authors,
  selectedAuthorId,
}: AddBookModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    isbn: '',
    authorId: '',
    genre: '',
    publishedDate: '',
    pages: '',
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (selectedAuthorId) {
      setFormData((prev) => ({ ...prev, authorId: selectedAuthorId }));
    }
  }, [selectedAuthorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      isbn: formData.isbn,
      authorId: formData.authorId,
      genre: formData.genre || undefined,
      publishedDate: formData.publishedDate || undefined,
      pages: formData.pages ? Number.parseInt(formData.pages) : undefined,
    });
  };

  const handleClose = () => {
    setFormData({
      title: '',
      isbn: '',
      authorId: '',
      genre: '',
      publishedDate: '',
      pages: '',
    });
    onClose();
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Add New Book
            </DrawerTitle>
            <DrawerDescription>
              Add a new book to your library. Select an author and fill in the
              book details.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto flex-1">
            <FormContent
              formData={formData}
              setFormData={setFormData}
              authors={authors}
              onSubmit={handleSubmit}
              onClose={handleClose}
              isMobile={isMobile}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Add New Book
          </DialogTitle>
          <DialogDescription>
            Add a new book to your library. Select an author and fill in the
            book details.
          </DialogDescription>
        </DialogHeader>
        <FormContent
          formData={formData}
          setFormData={setFormData}
          authors={authors}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
}
