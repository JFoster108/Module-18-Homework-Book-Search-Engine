import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = process.env.JWT_SECRET || 'yourSecretKey';
const expiration = '2h';

export const authMiddleware = async ({ req }: { req: Request }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ').pop()?.trim() || '';
  }

  try {
    const { data } = jwt.verify(token, secret) as { data: any };
    return { user: data };
  } catch {
    console.log('Invalid token');
    return { user: null };
  }
};

export const signToken = (user: { _id: string; username: string; email: string }) => {
  return jwt.sign({ data: user }, secret, { expiresIn: expiration });
};
