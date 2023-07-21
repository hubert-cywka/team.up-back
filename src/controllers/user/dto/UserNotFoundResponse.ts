import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class UserNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'User not found.');
  }
}

export default UserNotFoundResponse;
