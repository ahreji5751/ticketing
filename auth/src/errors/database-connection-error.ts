import HttpStatus from 'http-status-codes';

import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Error connecting to db');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors = () => [{ message: 'Error connection to database' }];   
}