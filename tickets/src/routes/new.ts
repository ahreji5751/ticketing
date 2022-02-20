import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { requireAuth } from '@ahreji-tickets/common';

const router: Router = Router();

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(HttpStatus.OK);
});

export default router;