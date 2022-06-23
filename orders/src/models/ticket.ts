import { model, Schema, Model, Document } from 'mongoose';

import Order, { OrderStatus } from './order';

interface ITicket {
  title: string;
  price: number;
}

interface TicketModel extends Model<TicketDoc> {
  new(attrs: ITicket): TicketDoc; 
  build(attrs: ITicket): Promise<TicketDoc>;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  isReserved: () => Promise<boolean>;
}

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: { 
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
});

schema.statics.new = (ticket: ITicket) => new Ticket(ticket);
schema.statics.build = (ticket: ITicket) => Ticket.create(ticket);
schema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created, 
        OrderStatus.AwaitingPayment, 
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', schema);

export default Ticket;