import { User } from '../../interfaces/User.interface';
import { AuthToken, AuthTokenData } from '../../interfaces/AuthToken.interface';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import TokensConfig from '../../config/TokensConfig';
import SignInRequest from '../../controllers/authentication/dto/SignInRequest.dto';
import UserRepository from '../../repositories/user/User.repository';

class AuthenticationService {
  private userRepository = new UserRepository();
  private readonly authTokenExpirationTime = TokensConfig.timeToExpire;
  private readonly authTokenSecret = TokensConfig.secret;

  constructor() {}

  public async authenticateUser(userToAuthenticate: SignInRequest) {
    const user = await this.userRepository.findUserByEmail(userToAuthenticate.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(userToAuthenticate.password, user.password);

      if (isPasswordMatching) {
        user.password = '';
        return user;
      }
    }

    return null;
  }

  public createAuthToken(user: User): AuthToken {
    const timeToExpire = 60 * this.authTokenExpirationTime;

    const dataStoredInToken: AuthTokenData = {
      _id: user._id
    };

    return {
      timeToExpire,
      token: jwt.sign(dataStoredInToken, this.authTokenSecret, {
        expiresIn: timeToExpire
      })
    };
  }

  public createAuthCookie(token: AuthToken) {
    return `Authorization=${token.token}; HttpOnly; Path=/; Max-Age=${token.timeToExpire}`;
  }
}

export default AuthenticationService;
