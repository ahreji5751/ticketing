import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent } from '@ahreji-tickets/common';

import Ticket from '../../../models/ticket';
import Order, { OrderStatus } from '../../../models/order';

import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 200 });
  const order = await Order.build({ ticket, userId: 'fsdfsdfsdf', status: OrderStatus.Created, expiresAt: new Date() });

  const event: ExpirationCompleteEvent = {
    orderId: order.id
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, order, event, msg };
}

it('updates order status to cancelled', async () => {
  const { listener, event, order, msg } = await setup();

  await listener.onMessage(event, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a order cancelled event', async () => {
  const { listener, event, msg, order } = await setup();

  await listener.onMessage(event, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const orderCancelledData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(orderCancelledData.id).toEqual(order.id);
});