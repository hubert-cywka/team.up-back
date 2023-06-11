import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class UserAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'User with that email already exists.');
  }
}

export default UserAlreadyExistsResponse;
