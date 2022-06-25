import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';

import { app } from '../../app';

it('returns a not authorized status if user is not authenticated', async () =>
  request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(HttpStatus.UNAUTHORIZED)
);

it('returns a nod found status if the order is not found', async () =>
  request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', cookie())
    .send()
    .expect(HttpStatus.NOT_FOUND)
);

it('returns a not authorized status if user tries to access the order which is not belongs to him', async () => {
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', cookie())
    .send({ ticketId: (await Ticket.build({ title: 'Concert', price: 20 })).id })
    .expect(HttpStatus.CREATED);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie())
    .send()
    .expect(HttpStatus.UNAUTHORIZED);
});

it('returns the ticket if the ticket is found', async () => {
  const user = cookie();

  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', user)
    .send({ ticketId: (await Ticket.build({ title: 'Concert', price: 20 })).id })
    .expect(HttpStatus.CREATED);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)  
    .send()
    .expect(HttpStatus.OK);

  expect(fetchedOrder.id).toEqual(order.id);
});