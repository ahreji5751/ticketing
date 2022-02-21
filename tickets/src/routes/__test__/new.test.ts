import request from 'supertest';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';

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
    .set('Cookie', cookie())
    .send({});

  expect(response.status).not.toEqual(HttpStatus.UNAUTHORIZED);  
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie())
    .send({ title: '', price: 10 })
    .expect(HttpStatus.BAD_REQUEST)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie())
    .send({ price: 10 })
    .expect(HttpStatus.BAD_REQUEST)  
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie())
    .send({ title: 'test', price: -10 })
    .expect(HttpStatus.BAD_REQUEST)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie())
    .send({ title: 'test' })
    .expect(HttpStatus.BAD_REQUEST)  
});

it('create a ticket with valid inputs', async () => {
  const ticket = { title: 'test', price: 20 };

  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie())
    .send(ticket)
    .expect(HttpStatus.CREATED);
  
  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(ticket.price);
  expect(tickets[0].title).toEqual(ticket.title);
});