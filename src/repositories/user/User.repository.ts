import { Model } from 'mongoose';
import { User } from '../../interfaces/User.interface';
import SignUpRequest from '../../controllers/authentication/dto/SignUpRequest.dto';
import { UserModel } from '../../models/User.model';

class UserRepository {
  private userModel: Model<User> = UserModel;

  constructor() {}

  public findUsersByEmail = async (email: string) => {
    return this.userModel.find({ email: email });
  };

  public findUserByEmail = async (email: string) => {
    return this.userModel.findOne({ email: email });
  };

  public saveUser = async (user: SignUpRequest) => {
    return this.userModel.create(user);
  };
}

export default UserRepository;
