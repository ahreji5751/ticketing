import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@ahreji-tickets/common';

import Ticket from '../../../models/ticket';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await Ticket.build({ price: 100, title: 'concert', userId: new mongoose.Types.ObjectId().toHexString() });
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const event: OrderCancelledEvent = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, event, msg };
}

it('unreserves the ticket', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const ticket = await Ticket.findById(event.ticket.id);

  expect(ticket!.orderId).toBeUndefined();
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

  expect(ticketUpdatedData.orderId).toBeUndefined();
});