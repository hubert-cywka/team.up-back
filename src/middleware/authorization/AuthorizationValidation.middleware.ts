import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserRole } from '../../types/users/UserRole';
import { RequestBodyWithUser } from '../../types/users/RequestBodyWithUser.interface';
import UserUnauthorizedResponse from '../../controllers/authentication/dto/UserUnauthorizedResponse';

function authorizationValidation<T>(allowedRoles: UserRole[]): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestBodyWithUser;
    const userToAuthorize = requestWithUser.user;
    if (allowedRoles.includes(userToAuthorize.role)) {
      next();
    } else {
      next(new UserUnauthorizedResponse());
    }
  };
}

export default authorizationValidation;
