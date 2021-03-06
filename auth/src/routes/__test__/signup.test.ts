import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('return a HTTP created status on successful signup', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED)
);

it('return a HTTP bad request status an invalid imail', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: '123456'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('return a HTTP bad request status an invalid password', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('return a HTTP bad request status with missing email', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      password: '12346'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('return a HTTP bad request status with missing password', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('dissallows duplicete emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.BAD_REQUEST);  
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED);

  expect(response.get('Set-Cookie')).toBeDefined();
});