import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('return a HTTP Created status on successful signup', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED)
);