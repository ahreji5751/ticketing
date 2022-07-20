import request from 'supertest';
import HttpStatus from 'http-status-codes';
import mongoose from 'mongoose';

import Order from '../../models/order';

import { app } from '../../app';
import { OrderStatus } from '@ahreji-tickets/common';

it('has a route handler listening to /api/payments for post request', async () => {
  const response = await request(app)
    .post('/api/payments')
    .send({});

  expect(response.status).not.toEqual(HttpStatus.NOT_FOUND);  
});

it('can only be accessed if the user is signed in', async () => 
  await request(app)
    .post('/api/payments')
    .send({})
    .expect(HttpStatus.UNAUTHORIZED)
);

it('returns a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({});

  expect(response.status).not.toEqual(HttpStatus.UNAUTHORIZED);  
});

it('returns an error if an invalid token is provided', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ token: '', orderId: 'test' })
    .expect(HttpStatus.BAD_REQUEST)

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ orderId: 'test' })
    .expect(HttpStatus.BAD_REQUEST)  
});

it('returns an error if an invalid order id is provided', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ token: 'test', orderId: '' })
    .expect(HttpStatus.BAD_REQUEST)

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ token: 'test' })
    .expect(HttpStatus.BAD_REQUEST)  
});

it('return a 404 when purchasing the order that does not exist', async () =>
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ token: 'test', orderId: new mongoose.Types.ObjectId().toHexString() })
    .expect(HttpStatus.NOT_FOUND)
);

it('return a 401 when purchasing the order that does belong to the user', async () => {
  const order = await Order.build({ 
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send({ token: 'test', orderId: order.id })
    .expect(HttpStatus.UNAUTHORIZED);
});

it('return a 400 when purchasing a cancelled order', async () => {
  const order = await Order.build({ 
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie(order.userId))
    .send({ token: 'test', orderId: order.id })
    .expect(HttpStatus.BAD_REQUEST);
});

/* it('create a chanre with valid inputs', async () => {
  const ticket = { title: 'test', price: 20 };

  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie())
    .send(ticket)
    .expect(HttpStatus.CREATED);
  
  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(ticket.price);
  expect(tickets[0].title).toEqual(ticket.title);
}); */