import * as bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user/User.repository';
import SignUpRequestBody from '../../controllers/authentication/dto/SignUpRequestBody.dto';
import UserDetailsResponse from '../../controllers/user/dto/UserDetailsResponse.dto';
import { DEFAULT_IMAGE } from '../../helpers/Constants';
import { User } from '../../types/User';
import { UserRole } from '../../types/UserRole';

class UserService {
  private userRepository: UserRepository;
  private PASSWORD_ENCRYPTION_SALT = 10;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public prepareUserDetailsFromUser = (user: User) => {
    return new UserDetailsResponse(user._id, user.name, user.email, user.role, user.image);
  };

  public prepareAllUsersDetails = async () => {
    const users = await this.userRepository.findAllUsers();
    return users.map((user) => {
      return this.prepareUserDetailsFromUser(user);
    });
  };

  public saveUser = async (userToSave: SignUpRequestBody) => {
    const userWithThatEmail = await this.userRepository.findUsersByEmail(userToSave.email);

    if (userWithThatEmail.length) {
      return null;
    }

    const encryptedPassword = await bcrypt.hash(userToSave.password, this.PASSWORD_ENCRYPTION_SALT);

    return await this.userRepository.saveUser({
      ...userToSave,
      password: encryptedPassword,
      role: UserRole.USER,
      image: DEFAULT_IMAGE
    });
  };

  public setUserRole = async (userId: string, role: UserRole) => {
    return await this.userRepository.setUserRoleById(userId, role);
  };
}

export default UserService;
