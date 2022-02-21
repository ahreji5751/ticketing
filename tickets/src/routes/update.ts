import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, validateRequest, requireAuth, NotAuthorizedError } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import Ticket from '../models/ticket';

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

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    res.send(ticket);
  }
);

export default router;