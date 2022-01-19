import express, { Express } from 'express';

import { json } from 'body-parser';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
import { errorHandler } from './middleware/error-handler';

const app: Express = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});