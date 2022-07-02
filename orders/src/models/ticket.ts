import { model, Schema, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import Order, { OrderStatus } from './order';

interface ITicket {
  id: string;
  title: string;
  price: number;
}

interface TicketModel extends Model<TicketDoc> {
  new(attrs: ITicket): TicketDoc; 
  build(attrs: ITicket): Promise<TicketDoc>;
  findByIdUsingVersion(filter: { id: string, version: number }): Promise<TicketDoc|null>;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  version: number;
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
  },
  versionKey: 'version'
});

schema.plugin(updateIfCurrentPlugin);

schema.statics.new = (ticket: ITicket) => new Ticket(ticket);
schema.statics.build = (ticket: ITicket) => Ticket.create({ _id: ticket.id, ...ticket });
schema.statics.findByIdUsingVersion = ({ id, version }: { id: string, version: number }) => Ticket.findOne({ _id: id, version: version - 1 });
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