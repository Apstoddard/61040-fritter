import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Like
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  freet: Types.ObjectId;
  dateLiked: Date;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  user: User;
  freet: Freet;
  dateLiked: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  dateLiked: {
    type: Date,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
