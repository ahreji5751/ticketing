import { model, Schema, Model, Document } from 'mongoose';

import Password from '../services/password';

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  new(attrs: IUser): UserDoc; 
  build(attrs: IUser): Promise<UserDoc>; 
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

const schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: { 
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
    versionKey: false
  }
});

schema.pre('save', async function(done) {
  if (this.isModified('password')) {
    this.set('password', await Password.toHash(this.get('password')));
  }
  done();
});

schema.statics.new = (user: IUser) => new User(user);
schema.statics.build = (user: IUser) => User.create(user);

const User = model<UserDoc, UserModel>('User', schema);

export default User;