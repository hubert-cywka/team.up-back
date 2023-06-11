import ErrorResponse from './ErrorResponse';
import { HttpStatusCode } from './HttpStatusCode';

class ResourceNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.NOT_FOUND, 'Resource not found.');
  }
}

export default ResourceNotFoundResponse;
