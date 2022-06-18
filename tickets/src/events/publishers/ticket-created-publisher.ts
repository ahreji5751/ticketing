import { Publisher, Subjects, TicketCreatedEvent } from '@ahreji-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent, Subjects.TicketCreated> {
  readonly subject = Subjects.TicketCreated;
}