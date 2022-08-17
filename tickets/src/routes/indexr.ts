import { Router, Request, Response } from 'express';
import { NotFoundError } from '@ahreji-tickets/common';

import Ticket from '../models/ticket';

const router: Router = Router();

router.get('/api/tickets', 
  async (req: Request, res: Response) => res.send(await Ticket.find({ orderId: undefined }))
);

export default router;