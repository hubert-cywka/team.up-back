import ErrorResponse from 'helpers/ErrorResponse';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../helpers/Logger';

function errorMiddleware(
  error: ErrorResponse,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Internal server error. Something went wrong.';

  if (status >= 500) {
    Logger.error(message);
  } else {
    Logger.warn(message);
  }

  response.status(status).send({ status, message });
}

export default errorMiddleware;
