import { User } from '../../../types/users/User.interface';

export type SaveUser = Omit<User, '_id'>;
