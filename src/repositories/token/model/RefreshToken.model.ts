import { model, Schema } from 'mongoose';
import { AuthToken } from '../../../types/token/AuthToken.interface';

const RefreshTokenSchema = new Schema({
  token: {
    required: true,
    type: String
  },
  timeToExpire: {
    required: true,
    type: String
  }
});

export const RefreshTokenModel = model<AuthToken>('RefreshToken', RefreshTokenSchema);
