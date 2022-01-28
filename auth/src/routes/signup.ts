import HttpStatus from 'http-status-codes';

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/user';

import { RequestValidationError, BadRequestError } from '../errors';

const router: Router = Router();

router.post(
  '/api/users/signup', 
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    res.status(HttpStatus.CREATED).send(await User.build({ email, password }));
  }
);

export default router;