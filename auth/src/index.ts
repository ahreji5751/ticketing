import express, { Express } from 'express';
import 'express-async-errors';

import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { json } from 'body-parser';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app: Express = express();

app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to DB');
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
}

start();

