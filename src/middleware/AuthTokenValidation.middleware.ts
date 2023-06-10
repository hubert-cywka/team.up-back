import { RequestWithUser } from '../interfaces/RequestWithUser';
import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthTokenData } from '../interfaces/AuthToken.interface';
import { UserModel } from '../models/User.model';
import InvalidAuthTokenException from '../exceptions/auth/InvalidAuthTokenException';

async function AuthTokenValidation(request: Request, response: Response, next: NextFunction) {
  const requestWithUser = request as RequestWithUser;
  const authorizationCookie = requestWithUser.cookies.Authorization;

  if (authorizationCookie) {
    const secret = process.env.JWT_SECRET!;

    try {
      const verificationResponse = jwt.verify(authorizationCookie, secret) as AuthTokenData;
      const userId = verificationResponse._id;
      const maybeUser = await UserModel.findById(userId);

      if (maybeUser) {
        requestWithUser.user = maybeUser;
        next();
      } else {
        next(new InvalidAuthTokenException());
      }
    } catch (e) {
      next(new InvalidAuthTokenException());
    }
  } else {
    next(new InvalidAuthTokenException());
  }
}

export default AuthTokenValidation;
