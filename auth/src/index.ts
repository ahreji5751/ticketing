import express, { Express } from 'express';

import { json } from 'body-parser';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';

const app: Express = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});