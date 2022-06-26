import mongoose from 'mongoose';
import request from 'supertest';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';
import Order, { OrderStatus } from '../../models/order';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders for post request', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});

  expect(response.status).not.toEqual(HttpStatus.NOT_FOUND);  
});

it('can only be accessed if the user is signed in', async () => 
  await request(app)
    .post('/api/orders')
    .send({})
    .expect(HttpStatus.UNAUTHORIZED)
);

it('returns a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({});

  expect(response.status).not.toEqual(HttpStatus.UNAUTHORIZED);  
});

it('returns an error if an invalid ticketId is provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({ ticketId: '' })
    .expect(HttpStatus.BAD_REQUEST);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({})
    .expect(HttpStatus.BAD_REQUEST); 
});

it('returns an error if the ticket does not exists', async () => 
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
    .expect(HttpStatus.NOT_FOUND)
);

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await Ticket.build({ title: 'Concert', price: 20 });

  Order.build({ ticket, userId: 'fsdfsdfsdf', status: OrderStatus.Created, expiresAt: new Date() });

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({ ticketId: ticket.id })
    .expect(HttpStatus.BAD_REQUEST)
});

it('creates an order with valid inputs', async () => {
  const ticket = await Ticket.build({ title: 'Concert', price: 20 });

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({ ticketId: ticket.id })
    .expect(HttpStatus.CREATED);
});

it('publishes an event', async () => {
  const ticket = await Ticket.build({ title: 'Concert', price: 20 });

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie())
    .send({ ticketId: ticket.id })
    .expect(HttpStatus.CREATED);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); 
});