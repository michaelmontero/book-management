import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book> & {
  author?: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    photo?: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Book {
  @Prop({
    required: true,
    trim: true,
    maxlength: 500,
  })
  title: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  isbn: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Author',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    type: Date,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Published date cannot be in the future',
    },
  })
  publishedDate?: Date;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  genre?: string;

  @Prop({
    trim: true,
    maxlength: 2000,
  })
  description?: string;

  @Prop({
    min: 1,
    max: 10000,
  })
  pages?: number;

  @Prop({
    trim: true,
    maxlength: 50,
    default: 'English',
  })
  language?: string;

  @Prop({
    trim: true,
    maxlength: 200,
  })
  publisher?: string;

  @Prop({
    trim: true,
  })
  coverImage?: string;

  @Prop({
    min: 0,
    validate: {
      validator: (price: number) => price >= 0,
      message: 'Price must be a positive number',
    },
  })
  price?: number;

  @Prop({
    default: true,
  })
  available: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Add virtual populate for author
BookSchema.virtual('author', {
  ref: 'Author',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

// Add indexes for better query performance
BookSchema.index({ authorId: 1 });
BookSchema.index({ genre: 1 });
BookSchema.index({ available: 1 });
BookSchema.index({ publishedDate: -1 });
BookSchema.index({ createdAt: -1 });
BookSchema.index({ title: 'text', description: 'text', genre: 'text' });
