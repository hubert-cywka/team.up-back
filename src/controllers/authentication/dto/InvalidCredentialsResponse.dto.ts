import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class InvalidCredentialsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Invalid credentials.');
  }
}

export default InvalidCredentialsResponse;
