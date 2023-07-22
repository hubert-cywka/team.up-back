import { NextFunction, Response, Request } from 'express';
import InvalidAuthTokenResponseDto from '../../controllers/authentication/dto/InvalidAuthTokenResponse.dto';
import { authenticationService } from '../../index';
import { RequestWithUser } from '../../shared/types/User';

async function authTokenValidation(request: Request, response: Response, next: NextFunction) {
  const requestWithUser = request as RequestWithUser;
  const authorizationCookie: string = requestWithUser.cookies.Authorization;

  if (authorizationCookie) {
    try {
      const maybeUser = await authenticationService.getUserFromToken(authorizationCookie, 'Authorization');
      if (maybeUser) {
        requestWithUser.user = maybeUser;
        return next();
      }
    } catch (e) {
      return next(new InvalidAuthTokenResponseDto());
    }
  }
  return next(new InvalidAuthTokenResponseDto());
}

export default authTokenValidation;
