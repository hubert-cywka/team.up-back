import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../types/controllers/Controller.interface';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import SignUpRequestBody from './dto/SignUpRequestBody.dto';
import SignInRequestBody from './dto/SignInRequestBody.dto';
import InvalidCredentialsResponse from './dto/InvalidCredentialsResponse';
import AuthenticationService from '../../services/authentication/Authentication.service';
import UserAlreadyExistsResponse from './dto/UserAlreadyExistsResponse';
import UserService from '../../services/user/User.service';
import authorizationValidation from '../../middleware/authorization/AuthorizationValidation.middleware';
import { UserRole } from '../../types/users/UserRole';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authenticationService = new AuthenticationService();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path.concat('/register'),
      dtoValidation(SignUpRequestBody),
      this.signUpUser
    );
    this.router.post(this.path.concat('/login'), dtoValidation(SignInRequestBody), this.signInUser);
    this.router.post(
      this.path.concat('/logout'),
      authorizationValidation([UserRole.USER, UserRole.ADMIN]),
      this.signOutUser
    );
  }

  signUpUser = async (request: Request, response: Response, next: NextFunction) => {
    const signUpData: SignUpRequestBody = request.body;
    const createdUser = await this.userService.saveUser(signUpData);

    if (createdUser) {
      response.send(createdUser);
    } else {
      next(new UserAlreadyExistsResponse());
    }
  };

  signInUser = async (request: Request, response: Response, next: NextFunction) => {
    const signInData: SignInRequestBody = request.body;
    const authenticatedUser = await this.authenticationService.authenticateUser(signInData);

    if (authenticatedUser) {
      const authToken = await this.authenticationService.createAuthToken(authenticatedUser);
      const authCookie = this.authenticationService.createAuthCookie(authToken);
      response.setHeader('Set-Cookie', [authCookie]);
      response.send(authenticatedUser);
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
