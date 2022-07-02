import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, requireAuth, NotAuthorizedError } from '@ahreji-tickets/common';

import Order, { OrderStatus } from '../models/order';

import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router: Router = Router();

router.delete('/api/orders/:orderId', 
  requireAuth, 
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    res.status(HttpStatus.NO_CONTENT).send();
  }
);

export default router;