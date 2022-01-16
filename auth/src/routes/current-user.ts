import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/api/users/currentuser', (req: Request, res: Response) => {
  res.send('Hi there!'); 
});

export default router;