import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class UserNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'User not found.');
  }
}

export default UserNotFoundResponse;
