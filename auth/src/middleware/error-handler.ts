import HttpStatus from 'http-status-codes';

import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}
	
	res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ errors: { message: err.message } });
}