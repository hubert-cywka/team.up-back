import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import TokensConfig from '../../config/TokensConfig';
import SignInRequestBody from '../../controllers/authentication/dto/SignInRequestBody.dto';
import UserRepository from '../../repositories/user/User.repository';
import SignInResponse from '../../controllers/authentication/dto/SignInResponse';
import TokenRepository from '../../repositories/token/Token.repository';
import UseCase from '../../../tests/UseCase';
import { User } from '../../types/User';
import { AuthToken, AuthTokenData } from '../../types/Token';

class AuthenticationService {
  private userRepository: UserRepository;
  private tokenRepository: TokenRepository;
  private readonly authTokenExpirationTime = TokensConfig.timeToExpire;
  private readonly refreshTokenExpirationTime = TokensConfig.refreshTokenTimeToExpire;
  private readonly authTokenSecret = TokensConfig.jwtSecret;
  private readonly refreshTokenSecret = TokensConfig.refreshTokenSecret;

  constructor(userRepository: UserRepository, tokenRepository: TokenRepository) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  public authenticateUser = async (userToAuthenticate: SignInRequestBody) => {
    const user = await this.userRepository.findUserByEmail(userToAuthenticate.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(userToAuthenticate.password, user.password);

      if (isPasswordMatching) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  public createAuthToken = async (user: User, type: 'Authorization' | 'RefreshToken'): Promise<AuthToken> => {
    const timeToExpire = type === 'Authorization' ? this.authTokenExpirationTime : this.refreshTokenExpirationTime;
    const secret = type === 'Authorization' ? this.authTokenSecret : this.refreshTokenSecret;
    const dataStoredInToken: AuthTokenData = {
      _id: user._id
    };

    const token: AuthToken = {
      timeToExpire,
      token: jwt.sign(dataStoredInToken, secret, {
        expiresIn: timeToExpire
      })
    };

    if (type === 'RefreshToken') {
      await this.tokenRepository.save(token);
    }

    return token;
  };

  public createAuthCookie = (token: AuthToken, type: 'Authorization' | 'RefreshToken') => {
    const path = type === 'RefreshToken' ? UseCase.PATH_REFRESH : '/';
    return `${type}=${token.token}; HttpOnly; Path=${path}; Max-Age=${token.timeToExpire}`;
  };

  public buildTokenCookies = async (user: User) => {
    const authToken = await this.createAuthToken(user, 'Authorization');
    const refreshToken = await this.createAuthToken(user, 'RefreshToken');
    const authCookie = this.createAuthCookie(authToken, 'Authorization');
    const refreshCookie = this.createAuthCookie(refreshToken, 'RefreshToken');
    return [authCookie, refreshCookie];
  };

  public getUserFromToken = async (token: string, type: 'Authorization' | 'RefreshToken') => {
    const secret = type === 'Authorization' ? TokensConfig.jwtSecret : TokensConfig.refreshTokenSecret;
    const verificationResponse = jwt.verify(token, secret) as AuthTokenData;

    if (type === 'RefreshToken') {
      const canRefresh = await this.tokenRepository.exists(token);
      if (!canRefresh) {
        return null;
      }
      await this.tokenRepository.deleteByToken(token);
    }

    return this.userRepository.findUserById(verificationResponse._id);
  };

  public prepareSignInResponseFromUser = (user: User) => {
    return new SignInResponse(user._id, user.name, user.email, user.role);
  };
}

export default AuthenticationService;
