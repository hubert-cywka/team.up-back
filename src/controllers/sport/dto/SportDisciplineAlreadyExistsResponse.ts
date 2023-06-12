import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class SportDisciplineAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'This sport discipline already exists.');
  }
}

export default SportDisciplineAlreadyExistsResponse;
