import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class InvalidAuthTokenResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Authorization token is invalid');
  }
}

export default InvalidAuthTokenResponse;
