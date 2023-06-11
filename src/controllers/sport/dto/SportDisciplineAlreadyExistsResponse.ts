import ErrorResponse from '../../../helpers/ErrorResponse';

class SportDisciplineAlreadyExistsResponse extends ErrorResponse {
  constructor() {
    super(409, 'This sport discipline already exists.');
  }
}

export default SportDisciplineAlreadyExistsResponse;
