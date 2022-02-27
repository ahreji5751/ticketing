import { Message } from 'node-nats-streaming';

import { Publisher } from './publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent, Subjects.TicketCreated> {
  readonly subject = Subjects.TicketCreated;
}