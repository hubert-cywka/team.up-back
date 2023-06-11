import ErrorResponse from '../../../helpers/ErrorResponse';
import { HttpStatusCode } from '../../../helpers/HttpStatusCode';

class SportDisciplineNotFoundResponse extends ErrorResponse {
  constructor() {
    super(HttpStatusCode.NOT_FOUND, 'Sport discipline not found.');
  }
}

export default SportDisciplineNotFoundResponse;
