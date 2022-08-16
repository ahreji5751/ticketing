import { model, Schema, Model, Document } from 'mongoose';

interface IPayment {
  stripeId: string;
  orderId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
  new(attrs: IPayment): PaymentDoc; 
  build(attrs: IPayment): Promise<PaymentDoc>;
}

export interface PaymentDoc extends Document {
  stripeId: string;
  orderId: string;
}

const schema = new Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true  
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

schema.statics.new = (payment: IPayment) => new Payment(payment);
schema.statics.build = (payment: IPayment) => Payment.create(payment);

const Payment = model<PaymentDoc, PaymentModel>('Payment', schema);

export default Payment;