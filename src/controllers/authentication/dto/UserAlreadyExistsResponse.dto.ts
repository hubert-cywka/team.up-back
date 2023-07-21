import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class UserAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'User with that email already exists.');
  }
}

export default UserAlreadyExistsResponse;
