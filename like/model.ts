import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
  dateLiked: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Like stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
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
