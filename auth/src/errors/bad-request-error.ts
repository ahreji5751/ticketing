import HttpStatus from 'http-status-codes';

import { CustomError  } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode: number = HttpStatus.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors = () => [{ message: this.message }];
}