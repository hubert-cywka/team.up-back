import ErrorResponse from 'helpers/ErrorResponse';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../helpers/Logger';

function errorMiddleware(error: ErrorResponse, request: Request, response: Response, next: NextFunction) {
  const INTERNAL_ERROR_MESSAGE = 'Internal server error. Something went wrong.';
  const status = error.status || 500;
  const message = status == 500 || !error.message ? INTERNAL_ERROR_MESSAGE : error.message;

  if (process.env.NODE_ENV !== 'test') {
    if (status >= 500) {
      Logger.error(error.message);
      Logger.error(error.stack);
    } else {
      Logger.warn(error.message);
      Logger.warn(error.stack);
    }
  }

  response.status(status).send({ status, message });
}

export default errorMiddleware;
