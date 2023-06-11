import { model, Schema } from 'mongoose';
import { User } from '../interfaces/User.interface';

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  birthdate: String,
  createdAt: String
});

export const UserModel = model<User>('User', UserSchema);
