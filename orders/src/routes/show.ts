import { Router, Request, Response } from 'express';
import { NotFoundError } from '@ahreji-tickets/common';

// import Ticket from '../models/ticket';

const router: Router = Router();

router.get('/api/orders/:id', 
  async (req: Request, res: Response) => {
   /*  const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    } */

    res.send({});
  }
);

export default router;