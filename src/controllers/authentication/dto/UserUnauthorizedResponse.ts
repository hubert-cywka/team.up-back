import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class UserUnauthorizedResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.FORBIDDEN, 'Access to resource not allowed. User is not authorized.');
  }
}

export default UserUnauthorizedResponse;
