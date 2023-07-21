import { Request } from 'express';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  birthdate: string;
  role: UserRole;
  image: string;
  createdAt?: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
