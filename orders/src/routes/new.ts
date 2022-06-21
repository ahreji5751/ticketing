import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest, BadRequestError } from '@ahreji-tickets/common';
import { body } from 'express-validator';

// import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import Ticket from '../models/ticket';
import Order from '../models/order';

const router: Router = Router();

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

    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created, 
          OrderStatus.AwaitingPayment, 
          OrderStatus.Complete
        ]
      }
    });
    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    /* await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      tittle: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    }); */

    res.status(HttpStatus.CREATED).send({});
  }
);

export default router;