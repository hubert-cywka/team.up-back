import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class InvalidCredentialsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Invalid credentials.');
  }
}

export default InvalidCredentialsResponse;
