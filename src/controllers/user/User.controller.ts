import Controller from '../../types/controllers/Controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { RequestWithUser } from '../../types/users/RequestWithUser.interface';
import authTokenValidation from '../../middleware/authentication/AuthTokenValidation.middleware';
import UserService from '../../services/user/User.service';
import UserNotFoundResponse from '../../services/user/dto/UserNotFoundResponse';
import authorizationValidation from '../../middleware/authorization/AuthorizationValidation.middleware';
import { UserRole } from '../../types/users/UserRole';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import ChangeRoleRequest from './dto/ChangeRoleRequest.dto';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router
      .all(this.path, authTokenValidation)
      .get(this.path, authorizationValidation([UserRole.ADMIN]), this.getAllUsersDetails)
      .get(this.path.concat('/me'), this.getSignedInUserDetails)
      .patch(
        this.path.concat('/:id'),
        dtoValidation(ChangeRoleRequest),
        authorizationValidation([UserRole.ADMIN]),
        this.changeUserRole
      );
  }

  getAllUsersDetails = async (request: Request, response: Response, next: NextFunction) => {
    response.send(await this.userService.prepareAllUsersDetails());
  };

  getSignedInUserDetails = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    if (!requestWithUser.user) {
      next(new UserNotFoundResponse());
    }
    response.send(this.userService.prepareUserDetailsFromUser(requestWithUser.user));
  };

  changeUserRole = async (request: Request, response: Response, next: NextFunction) => {
    const maybeUser = await this.userService.setUserRole(request.params.id, request.body.role);
    if (maybeUser) {
      response.send(this.userService.prepareUserDetailsFromUser(maybeUser));
    } else {
      next(new UserNotFoundResponse());
    }
  };
}

export default UserController;
