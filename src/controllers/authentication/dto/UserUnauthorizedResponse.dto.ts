import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class UserUnauthorizedResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.FORBIDDEN, 'Access to resource not allowed. User is not authorized.');
  }
}

export default UserUnauthorizedResponse;
