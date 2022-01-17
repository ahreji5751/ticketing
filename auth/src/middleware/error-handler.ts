import HttpStatus from 'http-status-codes';

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request ,res: Response, next: NextFunction) => {
	console.log('Something went wrong', err);
	
	res.status(HttpStatus.BAD_REQUEST).send({ message: err.message });
}