import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../nats-wrapper');
jest.mock('../stripe');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async collection => {
    await collection.deleteMany({});
  })
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.cookie = (userId?: string) => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const session = { jwt: jwt.sign({ id: userId || id, email: 'test@test.com'}, process.env.JWT_KEY!) };
  const jsonSession = JSON.stringify(session);

  return [`session=${Buffer.from(jsonSession).toString('base64')}`];
}