import * as bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user/User.repository';
import { UserRole } from '../../types/users/UserRole';
import SignUpRequestBody from '../../controllers/authentication/dto/SignUpRequestBody.dto';
import { User } from '../../types/users/User.interface';
import UserDetailsResponse from '../../controllers/user/dto/UserDetailsResponse.dto';

class UserService {
  private userRepository = new UserRepository();
  private PASSWORD_ENCRYPTION_SALT = 10;

  constructor() {}

  public prepareUserDetailsFromUser = (user: User) => {
    return new UserDetailsResponse(user._id, user.name, user.email, user.role);
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
      createdAt: new Date().toString(),
      role: UserRole.USER
    });
  };

  public setUserRole = async (userId: string, role: UserRole) => {
    return await this.userRepository.setUserRoleById(userId, role);
  };
}

export default UserService;
