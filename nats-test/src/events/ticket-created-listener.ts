import { Message } from 'node-nats-streaming';

import { Listener } from './listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent, Subjects.TicketCreated> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent, msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}