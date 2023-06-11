import { User } from './User.interface';
import { Request } from 'express';

export interface RequestBodyWithUser extends Request {
  user: User;
}
