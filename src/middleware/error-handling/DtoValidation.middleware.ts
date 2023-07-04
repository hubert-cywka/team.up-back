import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import ErrorResponse from '../../helpers/ErrorResponse';
import { HTTPStatus } from '../../helpers/HTTPStatus';

function dtoValidation<T>(type: any, allowSkippingCertainProperties: boolean = false): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), {
      skipMissingProperties: allowSkippingCertainProperties
    }).then((errors: ValidationError[]) => {
      if (errors.length) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints ?? '')).join(', ');
        next(new ErrorResponse(HTTPStatus.BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
}

export default dtoValidation;
