import { model, Schema, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ITicket {
  userId: string;
  price: number;
  title: string;
}

interface TicketModel extends Model<TicketDoc> {
  new(attrs: ITicket): TicketDoc; 
  build(attrs: ITicket): Promise<TicketDoc>; 
}

interface TicketDoc extends Document {
  userId: string;
  price: number;
  title: string;
  version: number;
  orderId?: string;
}

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  price: { 
    type: Number,
    required: true
  },
  title: { 
    type: String,
    required: true
  },
  orderId: {
    type: String
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
schema.statics.build = (ticket: ITicket) => Ticket.create(ticket);

const Ticket = model<TicketDoc, TicketModel>('Ticket', schema);

export default Ticket;