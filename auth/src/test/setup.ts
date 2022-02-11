import mongoose from 'mongoose';
import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../app';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async collection => {
    await collection.deleteMany({});
  })
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () =>
  (
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: '123456' })
      .expect(HttpStatus.CREATED)
  )
  .get('Set-Cookie');