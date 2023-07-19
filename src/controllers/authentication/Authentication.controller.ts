import { NextFunction, Request, Response, Router } from 'express';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import SignUpRequestBody from './dto/SignUpRequestBody.dto';
import SignInRequestBody from './dto/SignInRequestBody.dto';
import InvalidCredentialsResponse from './dto/InvalidCredentialsResponse.dto';
import AuthenticationService from '../../services/authentication/Authentication.service';
import UserAlreadyExistsResponse from './dto/UserAlreadyExistsResponse.dto';
import UserService from '../../services/user/User.service';
import { HTTPStatus } from '../../helpers/HTTPStatus';
import InvalidAuthTokenResponse from './dto/InvalidAuthTokenResponse.dto';
import InvalidRefreshTokenResponse from './dto/InvalidRefreshTokenResponse.dto';
import { Controller } from '../../types/Controller';
import { RequestWithUser } from '../../types/User';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authenticationService: AuthenticationService;
  private userService: UserService;

  constructor(authenticationService: AuthenticationService, userService: UserService) {
    this.authenticationService = authenticationService;
    this.userService = userService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path.concat('/register'), dtoValidation(SignUpRequestBody), this.signUpUser);
    this.router.post(this.path.concat('/login'), dtoValidation(SignInRequestBody), this.signInUser);
    this.router.post(this.path.concat('/logout'), this.signOutUser);
    this.router.post(this.path.concat('/refresh'), this.refreshToken);
  }

  signUpUser = async (request: Request, response: Response, next: NextFunction) => {
    const signUpData: SignUpRequestBody = request.body;
    const createdUser = await this.userService.saveUser(signUpData);

    if (createdUser) {
      response.sendStatus(HTTPStatus.OK);
    } else {
      return next(new UserAlreadyExistsResponse());
    }
  };

  signInUser = async (request: Request, response: Response, next: NextFunction) => {
    const signInData: SignInRequestBody = request.body;
    const authenticatedUser = await this.authenticationService.authenticateUser(signInData);

    if (authenticatedUser) {
      response.setHeader('Set-Cookie', await this.authenticationService.buildTokenCookies(authenticatedUser));
      response.send(this.authenticationService.prepareSignInResponseFromUser(authenticatedUser));
    } else {
      return next(new InvalidCredentialsResponse());
    }
  };

  private signOutUser = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', [
      'Authorization=; Max-age=0; Path=/; HttpOnly',
      'RefreshToken=; Max-age=0; Path=/; HttpOnly'
    ]);
    response.sendStatus(200);
  };

  refreshToken = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const refreshToken: string = requestWithUser.cookies.RefreshToken;

    if (!refreshToken) {
      return next(new InvalidAuthTokenResponse());
    }

    const user = await this.authenticationService.getUserFromToken(refreshToken, 'RefreshToken');

    if (user) {
      response.setHeader('Set-Cookie', await this.authenticationService.buildTokenCookies(user));
      response.sendStatus(HTTPStatus.OK);
    } else {
      next(new InvalidRefreshTokenResponse());
    }
  };
}

export default AuthenticationController;
