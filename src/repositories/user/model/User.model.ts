import { model, Schema } from 'mongoose';
import { User } from '../../../types/users/User.interface';
import { UserRole } from '../../../types/users/UserRole';

const UserSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  birthdate: {
    required: true,
    type: String
  },
  createdAt: {
    type: String,
    default: new Date().toString()
  },
  role: {
    type: String,
    enum: UserRole
  }
});

export const UserModel = model<User>('User', UserSchema);