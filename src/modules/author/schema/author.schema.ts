import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorDocument = Author &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  collection: 'authors',
})
export class Author {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Solo validación básica como respaldo
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  })
  email: string;

  @Prop({ trim: true })
  photo?: string;

  @Prop({ trim: true })
  bio?: string;

  @Prop({ trim: true })
  country?: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ type: [String], default: [] })
  socialMedia?: string[];

  @Prop({ type: [String], default: [] })
  awards?: string[];

  @Prop({ trim: true })
  agentContact?: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  booksCount?: number;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

AuthorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Add virtual for booksCount (to be populated from books collection)
AuthorSchema.virtual('booksCount', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'authorId',
  count: true,
});

// Ensure virtual fields are serialized
AuthorSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

AuthorSchema.set('toObject', { virtuals: true });

// Add indexes for better performance
AuthorSchema.index({ email: 1 }, { unique: true });
AuthorSchema.index({ firstName: 1, lastName: 1 });
AuthorSchema.index({ country: 1 });
AuthorSchema.index({ createdAt: -1 });

// Add text index for search functionality
AuthorSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  bio: 'text',
  country: 'text',
});
