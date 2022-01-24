import { model, Schema, Model, Document } from 'mongoose';

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  generate(attrs: IUser): UserDoc; 
  build(attrs: IUser): UserDoc; 
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
});

schema.statics.build = (user: IUser) => new User(user);
schema.statics.generate = (user: IUser) => User.create(user);

const User = model<UserDoc, UserModel>('User', schema);

export default User;