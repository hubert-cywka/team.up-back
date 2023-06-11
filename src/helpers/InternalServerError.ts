import ErrorResponse from './ErrorResponse';
import { HttpStatusCode } from './HttpStatusCode';

class InternalServerError extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.INTERNAL_SERVER, 'Internal server error. Something went wrong.');
  }
}

export default InternalServerError;
