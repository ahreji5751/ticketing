import { OrderStatus } from '@ahreji-tickets/common';
import { model, Schema, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface IOrder {
  id: string;
  userId: string;
  price: number;
  version: number;
  status: OrderStatus;
}

interface OrderModel extends Model<OrderDoc> {
  new(attrs: IOrder): OrderDoc; 
  build(attrs: IOrder): Promise<OrderDoc>;
}

export interface OrderDoc extends Document {
  userId: string;
  price: number;
  version: number;
  status: OrderStatus;
}

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  price: { 
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
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

schema.statics.new = (order: IOrder) => new Order(order);
schema.statics.build = (order: IOrder) => Order.create({ _id: order.id, ...order });

const Order = model<OrderDoc, OrderModel>('Order', schema);

export default Order;