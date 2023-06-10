import HttpException from '../HttpException';
import { HttpStatusCode } from '../HttpStatusCode';

class InvalidAuthTokenException extends HttpException {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED, 'Authorization token is invalid');
  }
}

export default InvalidAuthTokenException;
