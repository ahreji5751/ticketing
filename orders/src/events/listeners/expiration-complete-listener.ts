import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompleteEvent } from '@ahreji-tickets/common';

import Order, { OrderStatus } from '../../models/order';

import { queueGroupName } from '../config/queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent, Subjects.ExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(event: ExpirationCompleteEvent, msg: Message) {
    const order = await Order.findById(event.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status === OrderStatus.Complete) {
      return msg.ack();  
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id, 
      version: order.version, 
      ticket: { id: order.ticket.id }
    });
    
    msg.ack();
  }
}