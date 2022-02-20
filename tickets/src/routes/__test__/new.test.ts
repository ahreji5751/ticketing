import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(HttpStatus.NOT_FOUND);  
});

it('can only be accessed if the user is signed in', async () => 
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(HttpStatus.UNAUTHORIZED)
);

it('returns a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(HttpStatus.UNAUTHORIZED);  
});

it('returns an error if an invalid title is provided', async () => {

});

it('returns an error if an invalid price is provided', async () => {

});

it('create a ticket with valid inputs', async () => {

});