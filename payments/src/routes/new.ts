import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, NotAuthorizedError, OrderStatus, BadRequestError } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import Order from '../models/order';
import Payment from '../models/payment';

import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { stripe } from '../stripe';
import { natsWrapper } from '../nats-wrapper';

const router: Router = Router();

router.post('/api/payments', 
  requireAuth, 
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('Order id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order is cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    });

    const payment = await Payment.build({ orderId, stripeId: charge.id });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(HttpStatus.CREATED).send({ id: payment.id });
  }
);

export default router;