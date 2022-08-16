import { Publisher, Subjects, PaymentCreatedEvent } from '@ahreji-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent, Subjects.PaymentCreated> {
  readonly subject = Subjects.PaymentCreated;
}