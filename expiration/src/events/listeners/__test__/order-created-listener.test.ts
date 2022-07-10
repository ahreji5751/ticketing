import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@ahreji-tickets/common';

import Ticket from '../../../models/ticket';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await Ticket.build({ price: 100, title: 'concert', userId: new mongoose.Types.ObjectId().toHexString() });

  const event: OrderCreatedEvent = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    status: OrderStatus.Created,
    expiresAt: (new Date).toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, event, msg };
}

it('reserves the ticket', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const ticket = await Ticket.findById(event.ticket.id);

  expect(ticket!.orderId).not.toBeUndefined();
  expect(ticket!.orderId).toEqual(event.id);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(event.id).toEqual(ticketUpdatedData.orderId);
});