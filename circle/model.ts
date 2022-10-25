import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Circle
 */

// Type definition for Circle on the backend
export type Circle = {
  _id: Types.ObjectId;
  title: string;
  bio: string;
  dateCreated: Date;
  category: string;
  author: Types.ObjectId;
};

export type PopulatedCircle = {
  _id: Types.ObjectId;
  title: string;
  bio: string;
  dateCreated: Date;
  category: string;
  author: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Circles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CircleSchema = new Schema<Circle>({
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false
  },
  dateCreated: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
