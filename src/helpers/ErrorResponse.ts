import { Error } from 'mongoose';
import { HttpStatusCode } from './HttpStatusCode';

class ErrorResponse extends Error {
  status: HttpStatusCode;
  message: string;

  constructor(status: HttpStatusCode, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default ErrorResponse;
