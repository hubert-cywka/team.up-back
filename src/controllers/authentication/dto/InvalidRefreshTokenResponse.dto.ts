import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class InvalidAuthTokenResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Refresh token is invalid');
  }
}

export default InvalidAuthTokenResponse;
