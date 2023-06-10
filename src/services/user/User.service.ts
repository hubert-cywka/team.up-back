import * as bcrypt from 'bcrypt';
import SignUpRequest from '../../controllers/authentication/dto/SignUpRequest.dto';
import UserRepository from '../../repositories/user/User.repository';

class UserService {
  private userRepository = new UserRepository();
  private PASSWORD_ENCRYPTION_SALT = 10;

  constructor() {}

  public async saveUser(userToSave: SignUpRequest) {
    const userWithThatEmail = await this.userRepository.findUsersByEmail(userToSave.email);

    if (userWithThatEmail.length) {
      return null;
    }

    const encryptedPassword = await bcrypt.hash(userToSave.password, this.PASSWORD_ENCRYPTION_SALT);

    const createdUser = await this.userRepository.saveUser({
      ...userToSave,
      password: encryptedPassword
    });

    createdUser.password = '';
    return createdUser;
  }
}

export default UserService;
