import { Publisher, Subjects, OrderCancelledEvent } from '@ahreji-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent, Subjects.OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
}