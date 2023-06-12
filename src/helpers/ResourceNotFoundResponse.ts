import ErrorResponse from './ErrorResponse';
import { HTTPStatus } from './HTTPStatus';

class ResourceNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'Resource not found.');
  }
}

export default ResourceNotFoundResponse;
