import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class EventNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'Event not found.');
  }
}

export default EventNotFoundResponse;
