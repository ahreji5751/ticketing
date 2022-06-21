import { Router, Request, Response } from 'express';
import { NotFoundError } from '@ahreji-tickets/common';

// import Ticket from '../models/ticket';

const router: Router = Router();

router.get('/api/orders', 
  async (req: Request, res: Response) => res.send({} /* await Ticket.find() */)
);

export default router;