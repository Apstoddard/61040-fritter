import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  dateFollowed: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follow stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followingId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateFollowed: {
    type: Date,
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
