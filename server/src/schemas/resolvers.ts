import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { signToken } from '../services/auth.js';

export const me = async (_: any, __: any, context: any) => {
  if (context.user) {
    return await User.findById(context.user._id).populate('savedBooks');
  }
  throw new AuthenticationError('Not logged in');
};

export const books = async () => {
  return await Book.find();
};

export const login = async (_: any, { email, password }: { email: string, password: string }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.isCorrectPassword(password))) {
    throw new AuthenticationError('Invalid credentials');
  }

  const token = signToken(user);
  return { token, user };
};

export const addUser = async (_: any, { username, email, password }: { username: string, email: string, password: string }) => {
  const user = await User.create({ username, email, password });
  const token = signToken(user);
  return { token, user };
};

export const saveBook = async (_: any, { book }: { book: any }, context: any) => {
  if (context.user) {
    return await User.findByIdAndUpdate(
      context.user._id,
      { $push: { savedBooks: book } },
      { new: true }
    ).populate('savedBooks');
  }
  throw new AuthenticationError('Not logged in');
};

export const removeBook = async (_: any, { bookId }: { bookId: string }, context: any) => {
  if (context.user) {
    return await User.findByIdAndUpdate(
      context.user._id,
      { $pull: { savedBooks: { _id: bookId } } },
      { new: true }
    ).populate('savedBooks');
  }
  throw new AuthenticationError('Not logged in');
};

// Export resolvers object
export const resolvers = {
  Query: {
    me,
    books,
  },
  Mutation: {
    login,
    addUser,
    saveBook,
    removeBook,
  },
};
