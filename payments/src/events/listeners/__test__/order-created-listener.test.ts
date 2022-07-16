import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@ahreji-tickets/common';

import Order from '../../../models/order';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const event: OrderCreatedEvent = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: (new Date).toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 100
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, event, msg };
}

it('creates the order', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const order = await Order.findById(event.id);

  expect(order).not.toBeNull();
  expect(order!.id).toEqual(event.id);
  expect(order!.price).toEqual(event.ticket.price);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});