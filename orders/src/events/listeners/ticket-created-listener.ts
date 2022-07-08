import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@ahreji-tickets/common';

import Ticket from '../../models/ticket';

import { queueGroupName } from '../config/queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent, Subjects.TicketCreated> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(event: TicketCreatedEvent, msg: Message) {
    const { title, price, id } = event;
    
    await Ticket.build({ title, price, id });

    msg.ack();
  }
}