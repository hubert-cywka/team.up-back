import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class InvalidAuthTokenResponseDto extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Authorization token is invalid');
  }
}

export default InvalidAuthTokenResponseDto;
