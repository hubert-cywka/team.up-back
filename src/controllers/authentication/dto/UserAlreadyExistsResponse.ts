import HttpException from '../HttpException';
import { HttpStatusCode } from '../HttpStatusCode';

class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'User with that email already exists.');
  }
}

export default UserAlreadyExistsException;
