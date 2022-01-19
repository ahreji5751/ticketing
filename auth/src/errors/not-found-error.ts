import HttpStatus from 'http-status-codes';

import { CustomError  } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = HttpStatus.NOT_FOUND;

  constructor() {
    super('Resource not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors = () => [{ message:'Not found' }];
}