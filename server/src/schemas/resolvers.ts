import User, { IUser } from '../models/User.js';
import Book, { IBook } from '../models/Book.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any): Promise<IUser | null> => {
      if (context.user) {
        return await User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
    books: async (): Promise<IBook[] | null> => {
      return await Book.find({});
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string, password: string }): Promise<{ token: string; user: IUser } | null> => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (_parent: any, { username, email, password }: { username: string, email: string, password: string }): Promise<{ token: string; user: IUser } | null> => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_parent: any, { book }: { book: IBook }, context: any): Promise<IUser | null> => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedBooks: book } },
          { new: true }
        ).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },

    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any): Promise<IUser | null> => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { _id: bookId } } },
          { new: true }
        ).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

export default resolvers;
