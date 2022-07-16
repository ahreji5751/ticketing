import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent, OrderStatus } from '@ahreji-tickets/common';

import Order from '../../models/order';

import { queueGroupName } from '../config/queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent, Subjects.OrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(event: OrderCreatedEvent, msg: Message) {
    const { id, status, userId, version, ticket: { price } } = event;
    
    await Order.build({ id, price, status, userId, version });

    msg.ack();
  }
}