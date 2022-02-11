import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app';

it('responds with details about the current user', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', await signin())
    .send()
    .expect(HttpStatus.OK);

  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser).not.toBeNull();  
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(HttpStatus.OK);

  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser).toBeNull();
});