import { NextFunction, Response, Request } from 'express';
import InvalidAuthTokenResponseDto from '../../controllers/authentication/dto/InvalidAuthTokenResponse.dto';
import { authenticationService } from '../../server';
import { RequestWithUser } from '../../types/User';

async function authTokenValidation(request: Request, response: Response, next: NextFunction) {
  const requestWithUser = request as RequestWithUser;
  const authorizationCookie: string = requestWithUser.cookies.Authorization;

  if (authorizationCookie) {
    try {
      const maybeUser = await authenticationService.getUserFromToken(authorizationCookie, 'Authorization');

      if (maybeUser) {
        requestWithUser.user = maybeUser;
        next();
      } else {
        next(new InvalidAuthTokenResponseDto());
      }
    } catch (e) {
      next(new InvalidAuthTokenResponseDto());
    }
  } else {
    next(new InvalidAuthTokenResponseDto());
  }
}

export default authTokenValidation;
