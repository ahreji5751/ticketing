import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@ahreji-tickets/common';

import Order from '../../models/order';

import { queueGroupName } from '../config/queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent, Subjects.OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(event: OrderCancelledEvent, msg: Message) {
    const order = await Order.findById(event.id);

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    msg.ack();
  }
}