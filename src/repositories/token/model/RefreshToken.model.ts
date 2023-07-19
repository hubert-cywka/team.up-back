import { model, Schema } from 'mongoose';
import { AuthToken } from 'types/Token';

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
