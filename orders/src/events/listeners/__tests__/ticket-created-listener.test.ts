import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@ahreji-tickets/common';

import Ticket from '../../../models/ticket';

import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const event: TicketCreatedEvent = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, event, msg };
}

it('creates and saves a ticket', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const ticket = await Ticket.findById(event.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(event.title);
  expect(ticket!.price).toEqual(event.price);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});