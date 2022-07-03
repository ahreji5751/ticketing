import request from 'supertest';
import HttpStatus from 'http-status-codes';
import mongoose from 'mongoose';

import Ticket from '../../models/ticket';

import { app } from '../../app';

const buildTicket = async () => Ticket.build({ title: 'Concert', price: 20, id: new mongoose.Types.ObjectId().toHexString() });

it('can fetch a list of orders', async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = cookie();
  const userTwo = cookie();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(HttpStatus.CREATED);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(HttpStatus.CREATED);
  
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(HttpStatus.CREATED);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(HttpStatus.OK);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});