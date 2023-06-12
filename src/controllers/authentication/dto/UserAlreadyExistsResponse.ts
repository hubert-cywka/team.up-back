import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class UserAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'User with that email already exists.');
  }
}

export default UserAlreadyExistsResponse;
