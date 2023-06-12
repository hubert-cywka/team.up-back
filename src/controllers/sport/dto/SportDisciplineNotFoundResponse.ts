import ErrorResponse from '../../../helpers/ErrorResponse';
import { HTTPStatus } from '../../../helpers/HTTPStatus';

class SportDisciplineNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.NOT_FOUND, 'Sport discipline not found.');
  }
}

export default SportDisciplineNotFoundResponse;
