import { Router, Request, Response } from 'express';

const router: Router = Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  res.send('Hi there!'); 
});

export default router;