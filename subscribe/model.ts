import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Circle} from '../circle/model';

/**
 * This file defines the properties stored in a Subscribe
 */

// Type definition for Subscribe on the backend
export type Subscribe = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  circle: Types.ObjectId;
  dateSubscribed: Date;
};

export type PopulatedSubscribe = {
  _id: Types.ObjectId;
  user: User;
  circle: Circle;
  dateSubscribed: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Subscribes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SubscribeSchema = new Schema<Subscribe>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  circle: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Circle'
  },
  dateSubscribed: {
    type: Date,
    required: true
  }
});

const SubscribeModel = model<Subscribe>('Subscribe', SubscribeSchema);
export default SubscribeModel;
