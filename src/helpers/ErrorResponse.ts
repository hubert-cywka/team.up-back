import { Error } from 'mongoose';
import { HTTPStatus } from './HTTPStatus';

class ErrorResponse extends Error {
  status: HTTPStatus;
  message: string;

  constructor(status: HTTPStatus, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default ErrorResponse;
