import { model, Schema, Model, Document } from 'mongoose';

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

const Ticket = model<TicketDoc, TicketModel>('Ticket', schema);

export default Ticket;