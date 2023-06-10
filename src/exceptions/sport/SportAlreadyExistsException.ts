import HttpException from '../HttpException';

class SportAlreadyExistsException extends HttpException {
  constructor() {
    super(409, 'This sport already exists.');
  }
}

export default SportAlreadyExistsException;
