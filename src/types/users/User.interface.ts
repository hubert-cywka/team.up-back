import { UserRole } from './UserRole';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  birthdate: string;
  role: UserRole;
  createdAt?: string;
}
