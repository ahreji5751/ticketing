import express, { Express } from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@ahreji-tickets/common';

// import { createTicketRouter, showTicketRouter, indexTicketRouter, updateTicketRouter } from './routes';

const app: Express = express();

app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: app.get('env') !== 'test' }));
app.use(currentUser);

/* app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter); */

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };