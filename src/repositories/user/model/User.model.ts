import { model, Schema } from 'mongoose';
import { DEFAULT_IMAGE } from '../../../helpers/Constants';
import { User } from '../../../types/User';
import { UserRole } from '../../../types/UserRole';

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
  },
  image: {
    type: String,
    default: DEFAULT_IMAGE
  }
});

export const UserModel = model<User>('User', UserSchema);
