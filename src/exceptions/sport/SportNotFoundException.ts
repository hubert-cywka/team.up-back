import HttpException from '../HttpException';

class SportNotFoundException extends HttpException {
  constructor() {
    super(404, 'Sport not found.');
  }
}

export default SportNotFoundException;
