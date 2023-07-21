import { User } from '../../../shared/types/users/User.interface';

export type SaveUser = Omit<User, '_id'>;
