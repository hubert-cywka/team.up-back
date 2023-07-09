import { Model } from 'mongoose';
import { User } from '../../types/users/User.interface';
import { UserModel } from './model/User.model';
import { SaveUser } from '../../services/user/dto/SaveUser';
import { UserRole } from '../../types/users/UserRole';

class UserRepository {
  private userModel: Model<User> = UserModel;

  public findAllUsers = async () => {
    return this.userModel.find();
  };

  public findUsersByEmail = (email: string) => {
    return this.userModel.find({ email: email });
  };

  public  findUserByEmail = (email: string) => {
    return this.userModel.findOne({ email: email });
  };

  public findUserById = (id: string) => {
    return this.userModel.findOne({ _id: id });
  };

  public saveUser = (user: SaveUser) => {
    return this.userModel.create(user);
  };

  public setUserRoleById = (id: string, role: UserRole) => {
    return this.userModel.findOneAndUpdate({ _id: id }, { role: role }, { new: true });
  };
}

export default UserRepository;
