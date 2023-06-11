import HttpException from '../HttpException';
import { HttpStatusCode } from '../HttpStatusCode';

class InvalidCredentialsException extends HttpException {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED, 'Invalid credentials.');
  }
}

export default InvalidCredentialsException;
