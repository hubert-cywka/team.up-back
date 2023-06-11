import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class InvalidCredentialsResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED, 'Invalid credentials.');
  }
}

export default InvalidCredentialsResponse;
