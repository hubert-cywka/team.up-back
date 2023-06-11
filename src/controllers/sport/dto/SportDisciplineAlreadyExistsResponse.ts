import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class SportDisciplineAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'This sport discipline already exists.');
  }
}

export default SportDisciplineAlreadyExistsResponse;
