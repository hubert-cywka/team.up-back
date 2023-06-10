import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../interfaces/Controller.interface';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import SignUpRequest from './dto/SignUpRequest.dto';
import SignInRequest from './dto/SignInRequest.dto';
import InvalidCredentialsException from '../../exceptions/user/InvalidCredentialsException';
import AuthenticationService from '../../services/authentication/Authentication.service';
import UserAlreadyExistsException from '../../exceptions/user/UserAlreadyExistsException';
import UserService from '../../services/user/User.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authenticationService = new AuthenticationService();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path.concat('/register'), dtoValidation(SignUpRequest), this.signUpUser);
    this.router.post(this.path.concat('/login'), dtoValidation(SignInRequest), this.signInUser);
    this.router.post(this.path.concat('/logout'), this.signOutUser);
  }

  signUpUser = async (request: Request, response: Response, next: NextFunction) => {
    const signUpData: SignUpRequest = request.body;
    const createdUser = await this.userService.saveUser(signUpData);

    if (createdUser) {
      response.send(createdUser);
    } else {
      next(new UserAlreadyExistsException());
    }
  };

  signInUser = async (request: Request, response: Response, next: NextFunction) => {
    const signInData: SignInRequest = request.body;
    const authenticatedUser = await this.authenticationService.authenticateUser(signInData);

    if (authenticatedUser) {
      const authToken = await this.authenticationService.createAuthToken(authenticatedUser);
      const authCookie = this.authenticationService.createAuthCookie(authToken);
      response.setHeader('Set-Cookie', [authCookie]);
      response.send(authenticatedUser);
    } else {
      next(new InvalidCredentialsException());
    }
  };

  private signOutUser = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=; Max-age=0; Path=/; HttpOnly']);
    response.sendStatus(200);
  };
}

export default AuthenticationController;
