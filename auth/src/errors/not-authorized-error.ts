import HttpStatus from 'http-status-codes';

import { CustomError  } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode: number = HttpStatus.UNAUTHORIZED;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors = () => [{ message: 'Not authorized' }];
}