import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@ahreji-tickets/common';

import Ticket from '../../models/ticket';

import { queueGroupName } from '../config/queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent, Subjects.OrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(event: OrderCreatedEvent, msg: Message) {
    const { id: orderId, ticket: { id } } = event;
    
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.orderId = orderId;
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId, 
      version: ticket.version, 
      title: ticket.title, 
      price: ticket.price, 
      userId: ticket.userId
    });

    msg.ack();
  }
}