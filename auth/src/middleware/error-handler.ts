import HttpStatus from 'http-status-codes';

import { Request, Response, NextFunction } from 'express';

import { RequestValidationError, DatabaseConnectionError } from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof RequestValidationError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	if (err instanceof DatabaseConnectionError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}
	
	res.status(HttpStatus.BAD_REQUEST).send({ errors: { message: err.message } });
}