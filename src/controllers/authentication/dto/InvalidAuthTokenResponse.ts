import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class InvalidAuthTokenResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED, 'Authorization token is invalid');
  }
}

export default InvalidAuthTokenResponse;
