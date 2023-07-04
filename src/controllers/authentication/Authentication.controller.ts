import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../types/controllers/Controller.interface';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import SignUpRequestBody from './dto/SignUpRequestBody.dto';
import SignInRequestBody from './dto/SignInRequestBody.dto';
import InvalidCredentialsResponse from './dto/InvalidCredentialsResponse';
import AuthenticationService from '../../services/authentication/Authentication.service';
import UserAlreadyExistsResponse from './dto/UserAlreadyExistsResponse';
import UserService from '../../services/user/User.service';

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
  }

  signUpUser = async (request: Request, response: Response, next: NextFunction) => {
    const signUpData: SignUpRequestBody = request.body;
    const createdUser = await this.userService.saveUser(signUpData);

    if (createdUser) {
      response.send(this.userService.prepareUserDetailsFromUser(createdUser));
    } else {
      next(new UserAlreadyExistsResponse());
    }
  };

  signInUser = async (request: Request, response: Response, next: NextFunction) => {
    const signInData: SignInRequestBody = request.body;
    const authenticatedUser = await this.authenticationService.authenticateUser(signInData);

    if (authenticatedUser) {
      const authToken = this.authenticationService.createAuthToken(authenticatedUser);
      const authCookie = this.authenticationService.createAuthCookie(authToken);
      response.setHeader('Set-Cookie', [authCookie]);
      response.send(this.userService.prepareUserDetailsFromUser(authenticatedUser));
    } else {
      next(new InvalidCredentialsResponse());
    }
  };

  private signOutUser = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=; Max-age=0; Path=/; HttpOnly']);
    response.sendStatus(200);
  };
}

export default AuthenticationController;
