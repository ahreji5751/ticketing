import { Publisher, Subjects, ExpirationCompleteEvent } from '@ahreji-tickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent, Subjects.ExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
}