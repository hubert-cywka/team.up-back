import { User } from '../../types/users/User.interface';
import { AuthToken, AuthTokenData } from '../../types/token/AuthToken.interface';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import TokensConfig from '../../config/TokensConfig';
import SignInRequestBody from '../../controllers/authentication/dto/SignInRequestBody.dto';
import UserRepository from '../../repositories/user/User.repository';

class AuthenticationService {
  private userRepository = new UserRepository();
  private readonly authTokenExpirationTime = TokensConfig.timeToExpire;
  private readonly authTokenSecret = TokensConfig.secret;

  constructor() {}

  public authenticateUser = async (userToAuthenticate: SignInRequestBody) => {
    const user = await this.userRepository.findUserByEmail(userToAuthenticate.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(userToAuthenticate.password, user.password);

      if (isPasswordMatching) {
        user.password = '';
        return user;
      }
    }

    return null;
  };

  public createAuthToken = (user: User): AuthToken => {
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
  };

  public createAuthCookie = (token: AuthToken) => {
    return `Authorization=${token.token}; HttpOnly; Path=/; Max-Age=${token.timeToExpire}`;
  };

  public getUserFromToken = async (authorizationCookie: string) => {
    const verificationResponse = jwt.verify(
      authorizationCookie,
      TokensConfig.secret
    ) as AuthTokenData;
    return this.userRepository.findUserById(verificationResponse._id);
  };
}

export default AuthenticationService;
