import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follow
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId;
  dateFollowed: Date;
  user: Types.ObjectId;
  following: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId;
  dateFollowed: Date;
  user: User;
  following: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  dateFollowed: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  following: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
