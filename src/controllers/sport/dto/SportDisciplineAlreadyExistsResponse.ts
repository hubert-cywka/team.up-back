import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class SportDisciplineAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.CONFLICT, 'This sport discipline already exists.');
  }
}

export default SportDisciplineAlreadyExistsResponse;
