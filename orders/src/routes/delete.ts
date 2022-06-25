import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, requireAuth, NotAuthorizedError } from '@ahreji-tickets/common';

import Order, { OrderStatus } from '../models/order';

// import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router: Router = Router();

router.delete('/api/orders/:orderId', 
  requireAuth, 
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    /* await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      tittle: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    }); */

    res.status(HttpStatus.NO_CONTENT).send();
  }
);

export default router;