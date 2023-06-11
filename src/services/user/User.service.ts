import * as bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user/User.repository';
import { SaveUser } from './dto/SaveUser';
import { UserRole } from '../../types/users/UserRole';
import SignUpRequestBody from '../../controllers/authentication/dto/SignUpRequestBody.dto';

class UserService {
  private userRepository = new UserRepository();
  private PASSWORD_ENCRYPTION_SALT = 10;

  constructor() {}

  public saveUser = async (userToSave: SignUpRequestBody) => {
    const userWithThatEmail = await this.userRepository.findUsersByEmail(userToSave.email);

    if (userWithThatEmail.length) {
      return null;
    }

    const encryptedPassword = await bcrypt.hash(userToSave.password, this.PASSWORD_ENCRYPTION_SALT);

    const createdUser = await this.userRepository.saveUser({
      ...userToSave,
      password: encryptedPassword,
      createdAt: new Date().toString(),
      role: UserRole.USER
    });

    createdUser.password = '';
    return createdUser;
  };
}

export default UserService;
