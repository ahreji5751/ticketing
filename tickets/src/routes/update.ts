import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, validateRequest, requireAuth, NotAuthorizedError, BadRequestError } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import Ticket from '../models/ticket';

import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router: Router = Router();

router.put('/api/tickets/:id', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved'); 
    }

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.send(ticket);
  }
);

export default router;