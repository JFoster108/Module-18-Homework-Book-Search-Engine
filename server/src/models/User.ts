import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define an interface for TypeScript
export interface IUser extends Document {
  _id: string;  // ✅ Explicitly set _id as a string
  username: string;
  email: string;
  password: string;
  savedBooks: Types.ObjectId[];

  isCorrectPassword(password: string): Promise<boolean>;
}

// Define the Mongoose schema
const userSchema = new Schema<IUser>({
  _id: { type: String, auto: true }, // ✅ Force _id to be string
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check password
userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Export the model AND the interface
const User = model<IUser>('User', userSchema);
export default User;
