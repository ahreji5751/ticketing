import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@ahreji-tickets/common';

import Ticket from '../../models/ticket';

import { queueGroupName } from '../config/queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent, Subjects.TicketUpdated> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent, msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByIdUsingVersion({ id, version });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}