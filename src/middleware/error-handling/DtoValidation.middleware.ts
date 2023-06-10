import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../../exceptions/HttpException';
import { HttpStatusCode } from '../../exceptions/HttpStatusCode';

function dtoValidation<T>(
  type: any,
  allowSkippingCertainProperties: boolean = false
): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), {
      skipMissingProperties: allowSkippingCertainProperties
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints ?? ''))
          .join(', ');
        next(new HttpException(HttpStatusCode.BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
}

export default dtoValidation;
