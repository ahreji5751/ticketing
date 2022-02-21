import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';

import { app } from '../../app';

it('returns a nod found status if the ticket is not found', async () =>
  request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(HttpStatus.NOT_FOUND)
);

it('returns the ticket if the ticket is found', async () => {
  const tiket = await Ticket.build({ 
    title: 'Concert', 
    price: 20, 
    userId: new mongoose.Types.ObjectId().toHexString() 
  });

  const response = await request(app)
    .get(`/api/tickets/${tiket.id}`)
    .send()
    .expect(HttpStatus.OK);

  expect(response.body.title).toEqual(tiket.title);
  expect(response.body.price).toEqual(tiket.price);
});