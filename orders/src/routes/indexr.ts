import { Router, Request, Response } from 'express';
import { requireAuth } from '@ahreji-tickets/common';

import Order from '../models/order';

const router: Router = Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => 
  res.send(await Order.find({ userId: req.currentUser!.id }).populate('ticket'))
);

export default router;