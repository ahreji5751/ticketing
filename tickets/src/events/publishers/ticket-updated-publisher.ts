import { Publisher, Subjects, TicketUpdatedEvent } from '@ahreji-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent, Subjects.TicketUpdated> {
  readonly subject = Subjects.TicketUpdated;
}