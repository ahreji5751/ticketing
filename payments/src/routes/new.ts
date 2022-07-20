import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, NotAuthorizedError, OrderStatus, BadRequestError } from '@ahreji-tickets/common';
import { body } from 'express-validator';

import Order from '../models/order';

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

    res.send({ success: true });
  }
);

export default router;