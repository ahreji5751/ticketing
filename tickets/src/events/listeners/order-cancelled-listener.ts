import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent } from '@ahreji-tickets/common';

import Ticket from '../../models/ticket';

import { queueGroupName } from '../config/queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent, Subjects.OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(event: OrderCancelledEvent, msg: Message) {
    const { ticket: { id } } = event;
    
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.orderId = undefined;
    await ticket.save();
    
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId, 
      version: ticket.version, 
      title: ticket.title, 
      price: ticket.price, 
      userId: ticket.userId
    });

    msg.ack();
  }
}