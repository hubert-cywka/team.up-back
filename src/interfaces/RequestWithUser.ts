import { User } from './User.interface';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
