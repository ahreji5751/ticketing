
declare namespace Express {
	interface Request {
		currentUser?: UserPayload;
	}
}