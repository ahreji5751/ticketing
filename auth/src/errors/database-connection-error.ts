import HttpStatus from 'http-status-codes';

export class DatabaseConnectionError extends Error {
  reason: string = 'Error connection to database';
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.reason }];   
  }
}