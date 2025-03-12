import { Schema, model, Document } from 'mongoose';

// Define an interface for TypeScript
export interface IBook extends Document {
  title: string;
  authors: string[];
  description?: string;
  image?: string;
  link?: string;
}

// Define the Mongoose schema
const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  authors: [{ type: String, required: true }],
  description: String,
  image: String,
  link: String,
});

// Export the model AND the interface
const Book = model<IBook>('Book', bookSchema);
export default Book;
