import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Subscribe = {
  subscriberId: Types.ObjectId;
  circleId: Types.ObjectId;
  dateSubscribed: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follow stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SubscribeSchema = new Schema<Subscribe>({
  subscriberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  circleId: {
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
