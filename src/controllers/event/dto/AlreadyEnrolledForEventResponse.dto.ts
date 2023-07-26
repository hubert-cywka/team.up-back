import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class AlreadyEnrolledForEventResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'You already enrolled for this event.');
  }
}

export default AlreadyEnrolledForEventResponse;
