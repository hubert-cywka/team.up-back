import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class NeverEnrolledForEventResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'You never enrolled for this event.');
  }
}

export default NeverEnrolledForEventResponse;
