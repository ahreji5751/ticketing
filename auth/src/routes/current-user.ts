import { Router, Request, Response } from 'express';
import { currentUser } from '@ahreji-tickets/common';

const router: Router = Router();

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;