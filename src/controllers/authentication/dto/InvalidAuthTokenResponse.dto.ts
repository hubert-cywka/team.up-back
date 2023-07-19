import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class InvalidAuthTokenResponseDto extends ErrorResponse {
  constructor() {
    super(HTTPStatus.UNAUTHORIZED, 'Authorization token is invalid');
  }
}

export default InvalidAuthTokenResponseDto;
