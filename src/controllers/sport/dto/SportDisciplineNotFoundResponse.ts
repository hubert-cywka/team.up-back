import ErrorResponse from '../../../helpers/ErrorResponse';

class SportDisciplineNotFoundResponse extends ErrorResponse {
  constructor() {
    super(404, 'Sport discipline not found.');
  }
}

export default SportDisciplineNotFoundResponse;
