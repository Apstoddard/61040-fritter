import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Circle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Circle on the backend
export type Circle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  title: string;
  bio: string;
  category: string;
  dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Circle stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CircleSchema = new Schema<Circle>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The title of the circle
  title: {
    type: String,
    required: true
  },
  // The bio of the circle
  bio: {
    type: String,
    required: true
  },
  // The category of the circle
  category: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
