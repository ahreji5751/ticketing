import { model, Schema, Model, Document } from 'mongoose';
import { OrderStatus } from '@ahreji-tickets/common';

import { TicketDoc } from './ticket';

interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  new(attrs: IOrder): OrderDoc; 
  build(attrs: IOrder): Promise<OrderDoc>; 
}

interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  status: { 
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created 
  },
  expiresAt: { 
    type: Schema.Types.Date
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
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

schema.statics.new = (order: IOrder) => new Order(order);
schema.statics.build = (order: IOrder) => Order.create(order);

const Order = model<OrderDoc, OrderModel>('Order', schema);

export default Order;