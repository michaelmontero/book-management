import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Author {
  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Invalid email format',
    },
  })
  email: string;

  @Prop({
    trim: true,
  })
  photo?: string;

  @Prop({
    trim: true,
    maxlength: 1000,
  })
  bio?: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  country?: string;

  @Prop({
    type: [String],
    default: [],
  })
  socialMedia: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

// Add virtual for full name
AuthorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Add virtual populate for books
AuthorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'authorId',
});

// Add indexes
AuthorSchema.index({ email: 1 });
AuthorSchema.index({ firstName: 1, lastName: 1 });
AuthorSchema.index({ country: 1 });
