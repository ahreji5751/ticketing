import HttpStatus from 'http-status-codes';
import moment from 'moment';

import { Router, Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import Ticket from '../models/ticket';
import Order from '../models/order';

const router: Router = Router();

const EXPIRATION_WINDOW_MINUTES = 1;

router.post('/api/orders', 
  requireAuth, 
  [
    body('ticketId').not().isEmpty().withMessage('Ticket id must be provided ')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const order = await Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: moment().add(EXPIRATION_WINDOW_MINUTES, 'minutes').toDate(),
      ticket
    });

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price  
      }
    });

    res.status(HttpStatus.CREATED).send(order);
  }
);

export default router;