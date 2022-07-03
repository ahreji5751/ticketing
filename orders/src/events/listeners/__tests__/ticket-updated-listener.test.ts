import mongoose from 'mongoose';

import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@ahreji-tickets/common';

import Ticket from '../../../models/ticket';

import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 200 });

  const event: TicketUpdatedEvent = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()  
  }

  return { listener, ticket, event, msg };
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, event, ticket, msg } = await setup();

  await listener.onMessage(event, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(event.title);
  expect(updatedTicket!.price).toEqual(event.price);
  expect(updatedTicket!.version).toEqual(event.version);
});

it('acks the message', async () => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, event, msg } = await setup();

  event.version = 10;

  await expect(async () => await listener.onMessage(event, msg))
    .rejects
    .toThrow();

  expect(msg.ack).not.toHaveBeenCalled();
});