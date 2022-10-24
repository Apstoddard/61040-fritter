import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  bio: string;
  password: string;
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
