import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@ahreji-tickets/common';

import Order from '../../models/order';

import { queueGroupName } from '../config/queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent, Subjects.PaymentCreated> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(event: PaymentCreatedEvent, msg: Message) {
    const order = await Order.findById(event.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = OrderStatus.Complete;
    await order.save();

    msg.ack();
  }
}