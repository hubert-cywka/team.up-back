import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class EventNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'Event not found.');
  }
}

export default EventNotFoundResponse;
