import HttpException from '../HttpException';

class SportDisciplineAlreadyExistsException extends HttpException {
  constructor() {
    super(409, 'This sport discipline already exists.');
  }
}

export default SportDisciplineAlreadyExistsException;
