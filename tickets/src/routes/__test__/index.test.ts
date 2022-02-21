import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';

import { app } from '../../app';

it('can fetch a list of tickets', async () => {
  await Ticket.insertMany([
    { title: 'Concert', price: 20, userId: new mongoose.Types.ObjectId().toHexString() },
    { title: 'Second Concert', price: 30, userId: new mongoose.Types.ObjectId().toHexString() },
    { title: 'Third Concert', price: 40, userId: new mongoose.Types.ObjectId().toHexString() },
  ]);

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(HttpStatus.OK);

  expect(response.body).toHaveLength(3);
});