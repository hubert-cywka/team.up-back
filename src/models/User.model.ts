import { model, Schema } from 'mongoose';
import { User } from '../interfaces/User.interface';

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  birthdate: String
});

export const UserModel = model<User>('User', userSchema);
