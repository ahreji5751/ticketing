import HttpStatus from 'http-status-codes';

import { ValidationError  } from 'express-validator';

export class RequestValidationError extends Error {
  statusCode: number = HttpStatus.BAD_REQUEST;

  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(({ msg, param }) => ({ message: msg, field: param }));   
  }
}