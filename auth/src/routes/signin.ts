import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@ahreji-tickets/common';

import User from '../models/user';
import Password from '../services/password';

const router: Router = Router();

router.post('/api/users/signin', 
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid creadentials');
    }

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid creadentials');  
    }

    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
    req.session!.jwt = userJwt;    

    res.status(HttpStatus.OK).send(user);
  }
);

export default router;