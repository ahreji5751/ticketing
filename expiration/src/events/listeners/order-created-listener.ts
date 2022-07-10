import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@ahreji-tickets/common';

import expirationQueue from '../../queues/expiration-queue';

import { queueGroupName } from '../config/queue-group-name';
import moment from 'moment';

export class OrderCreatedListener extends Listener<OrderCreatedEvent, Subjects.OrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(event: OrderCreatedEvent, msg: Message) {
    await expirationQueue.add({ orderId: event.id }, { delay: moment(event.expiresAt).diff(moment()) });

    msg.ack();
  }
}