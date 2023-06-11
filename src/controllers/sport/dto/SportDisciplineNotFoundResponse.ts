import HttpException from '../HttpException';

class SportDisciplineNotFoundException extends HttpException {
  constructor() {
    super(404, 'Sport discipline not found.');
  }
}

export default SportDisciplineNotFoundException;
