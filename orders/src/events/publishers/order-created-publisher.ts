import { Publisher, Subjects, OrderCreatedEvent } from '@ahreji-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent, Subjects.OrderCreated> {
  readonly subject = Subjects.OrderCreated;
}