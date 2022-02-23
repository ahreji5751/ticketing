import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import Ticket from '../models/ticket';

const router: Router = Router();

router.post('/api/tickets', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({ title, price, userId: req.currentUser!.id });

    res.status(HttpStatus.CREATED).send(ticket);
  }
);

export default router;