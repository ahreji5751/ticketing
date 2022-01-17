export class DatabaseConnectionError extends Error {
  reason: string = 'Error connection to database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}