import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import Ticket from '../../models/ticket';
import Order, { OrderStatus } from '../../models/order';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a nod found status if the order is not found', async () =>
  request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', cookie())
    .expect(HttpStatus.NOT_FOUND)
);

it('returns not authenticated status if user is not authenticated', async () => 
  request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
    .expect(HttpStatus.UNAUTHORIZED)
);

it('returns not authenticated status if user does not own this order', async () => {
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', cookie())
    .send({ ticketId: (await Ticket.build({ title: 'Concert', price: 20 })).id })
    .expect(HttpStatus.CREATED);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie()) 
    .send()
    .expect(HttpStatus.UNAUTHORIZED);
});

it('successfully deletes an order', async () => {
  const user = cookie();

  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', user)
    .send({ ticketId: (await Ticket.build({ title: 'Concert', price: 20 })).id })
    .expect(HttpStatus.CREATED);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)  
    .send()
    .expect(HttpStatus.NO_CONTENT);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

/* it('publishes an event', async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled(); 
}); */