import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('clears the cooke after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED);
  
  const response = await request(app)
    .post('/api/users/signout')
    .expect(HttpStatus.OK);

  expect(response.get('Set-Cookie')[0]).toContain('session=;');
});