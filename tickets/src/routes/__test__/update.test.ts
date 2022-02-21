import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';

import { app } from '../../app';

it('returns a nod found status if the ticket is not found', async () =>
  request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', cookie())
    .send({ title: 'test', price: 10 })
    .expect(HttpStatus.NOT_FOUND)
);

it('returns not authenticated status if user is not authenticated', async () => {
  request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({ title: 'test', price: 10 })
    .expect(HttpStatus.UNAUTHORIZED)
});

it('returns not authenticated status if user does not own this ticket', async () => {
  const tiket = await Ticket.build({ 
    title: 'Concert', 
    price: 20, 
    userId: new mongoose.Types.ObjectId().toHexString() 
  });

  await request(app)
    .put(`/api/tickets/${tiket.id}`)
    .set('Cookie', cookie())
    .send({ title: 'new title', price: 100 })
    .expect(HttpStatus.UNAUTHORIZED)
});

it('returns a bad request status if the user provides an invalid title or price', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const tiket = await Ticket.build({ 
    title: 'Concert', 
    price: 20, 
    userId
  });

  await request(app)
    .put(`/api/tickets/${tiket.id}`)
    .set('Cookie', cookie(userId))
    .send({ title: '', price: 20 })
    .expect(HttpStatus.BAD_REQUEST);
  
  await request(app)
    .put(`/api/tickets/${tiket.id}`)
    .set('Cookie', cookie(userId))
    .send({ title: 'new title', price: -10 })
    .expect(HttpStatus.BAD_REQUEST);
});

it('updates the ticket provided valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const tiket = await Ticket.build({ 
    title: 'Concert', 
    price: 20, 
    userId
  });

  await request(app)
    .put(`/api/tickets/${tiket.id}`)
    .set('Cookie', cookie(userId))
    .send({ title: 'new title', price: 100 })
    .expect(HttpStatus.OK);
  
  const updatedTicket = await Ticket.findById(tiket.id);

  expect(updatedTicket).not.toBeNull();
  expect(updatedTicket!.title).toEqual('new title');
  expect(updatedTicket!.price).toEqual(100);
});