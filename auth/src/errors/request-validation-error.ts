import HttpStatus from 'http-status-codes';

import { ValidationError  } from 'express-validator';
import { CustomError  } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode: number = HttpStatus.BAD_REQUEST;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors = () => this.errors.map(({ msg, param }) => ({ message: msg, field: param }));
}