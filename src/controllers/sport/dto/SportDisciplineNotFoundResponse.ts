import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class SportDisciplineNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'Sport discipline not found.');
  }
}

export default SportDisciplineNotFoundResponse;
