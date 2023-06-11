import { NextFunction, Response, Request } from 'express';
import InvalidAuthTokenResponse from '../../controllers/authentication/dto/InvalidAuthTokenResponse';
import { RequestBodyWithUser } from '../../types/users/RequestBodyWithUser.interface';
import AuthenticationService from '../../services/authentication/Authentication.service';

async function AuthTokenValidation(request: Request, response: Response, next: NextFunction) {
  const requestWithUser = request as RequestBodyWithUser;
  const authorizationCookie: string = requestWithUser.cookies.Authorization;
  const authenticationService = new AuthenticationService();

  if (authorizationCookie) {
    try {
      const maybeUser = await authenticationService.getUserFromToken(authorizationCookie);

      if (maybeUser) {
        requestWithUser.user = maybeUser;
        next();
      } else {
        next(new InvalidAuthTokenResponse());
      }
    } catch (e) {
      next(new InvalidAuthTokenResponse());
    }
  } else {
    next(new InvalidAuthTokenResponse());
  }
}

export default AuthTokenValidation;
