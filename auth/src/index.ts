import express, { Express } from 'express';
import 'express-async-errors';

import { json } from 'body-parser';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app: Express = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});