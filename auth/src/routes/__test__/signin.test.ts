import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('return a HTTP bad request status an invalid imail', async () =>
  request(app)
    .post('/api/users/signin')
    .send({
      email: 'testtest.com',
      password: '123456'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('return a HTTP bad request status with missing email', async () =>
  request(app)
    .post('/api/users/signin')
    .send({
      password: '12346'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('return a HTTP bad request status with missing password', async () =>
  request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('fails when a email that does not exist is supplied', async () =>
  request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.BAD_REQUEST)
);

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED);
  
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'sdasd'
    })
    .expect(HttpStatus.BAD_REQUEST);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.CREATED);
  
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(HttpStatus.OK);

  expect(response.get('Set-Cookie')).toBeDefined();
});