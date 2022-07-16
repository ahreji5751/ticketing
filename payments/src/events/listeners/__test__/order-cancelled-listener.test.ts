import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@ahreji-tickets/common';

import Order from '../../../models/order';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Order.build({ 
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  });

  const event: OrderCancelledEvent = {
    version: order.version,
    id: order.id,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString()
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, event, msg };
}

it('cancells the order', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const order = await Order.findById(event.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});