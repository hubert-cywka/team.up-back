import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class UserNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.NOT_FOUND, 'User not found.');
  }
}

export default UserNotFoundResponse;
