import Controller from '../interfaces/Controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import SignUpDto from '../dto/SignUp.dto';
import { UserModel } from '../models/User.model';
import UserAlreadyExistsException from '../exceptions/user/UserAlreadyExistsException';
import dtoValidation from '../middleware/DtoValidation.middleware';
import SignInDto from '../dto/SignIn.dto';
import InvalidCredentialsException from '../exceptions/user/InvalidCredentialsException';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthToken, AuthTokenData } from '../interfaces/AuthToken.interface';
import { User } from '../interfaces/User.interface';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = UserModel;
  private readonly authTokenExpirationTime;
  private readonly authTokenSecret;

  private PASSWORD_ENCRYPTION_SALT = 10;

  constructor(tokenExpirationTime: number, tokenSecret: string) {
    this.authTokenExpirationTime = tokenExpirationTime;
    this.authTokenSecret = tokenSecret;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path.concat('/register'), dtoValidation(SignUpDto), this.signUpUser);
    this.router.post(this.path.concat('/login'), dtoValidation(SignInDto), this.signInUser);
    this.router.post(this.path.concat('/logout'), this.signOutUser);
  }

  signUpUser = async (request: Request, response: Response, next: NextFunction) => {
    const signUpData: SignUpDto = request.body;
    const userWithThatEmail = await this.user.find({
      email: signUpData.email
    });

    if (userWithThatEmail.length) {
      next(new UserAlreadyExistsException());
    } else {
      const encryptedPassword = await bcrypt.hash(
        signUpData.password,
        this.PASSWORD_ENCRYPTION_SALT
      );
      const createdUser = await this.user.create({
        ...signUpData,
        password: encryptedPassword
      });
      createdUser.password = '';
      response.send(createdUser);
    }
  };

  signInUser = async (request: Request, response: Response, next: NextFunction) => {
    const signInData: SignInDto = request.body;
    const user = await this.user.findOne({ email: signInData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(signInData.password, user.password);
      if (isPasswordMatching) {
        user.password = '';
        const authToken = this.createAuthToken(user);
        response.setHeader('Set-Cookie', [this.createAuthCookie(authToken)]);
        response.send(user);
      } else {
        next(new InvalidCredentialsException());
      }
    } else {
      next(new InvalidCredentialsException());
    }
  };

  private signOutUser = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=; Max-age=0; Path=/; HttpOnly']);
    response.sendStatus(200);
  };

  private createAuthToken(user: User): AuthToken {
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

  private createAuthCookie(token: AuthToken) {
    return `Authorization=${token.token}; HttpOnly; Path=/; Max-Age=${token.timeToExpire}`;
  }
}

export default AuthenticationController;
