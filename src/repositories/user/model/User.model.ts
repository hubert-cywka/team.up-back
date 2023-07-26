import { model, Schema } from 'mongoose';
import { DEFAULT_IMAGE } from '../../../shared/helpers/Constants';
import { User } from '../../../shared/types/User';
import { UserRole } from '../../../shared/types/UserRole';
import { UserEventModel } from '../../userevent/model/UserEvent.model';

const UserSchema = new Schema(
  {
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
    role: {
      type: String,
      enum: UserRole
    },
    image: {
      type: String,
      default: DEFAULT_IMAGE
    }
  },
  { timestamps: true }
).pre('findOneAndDelete', { document: false, query: true }, async function () {
  const user = await this.model.findOne(this.getFilter());
  await UserEventModel.deleteMany({ userId: user._id });
});

export const UserModel = model<User>('User', UserSchema);
