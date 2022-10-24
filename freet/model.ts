import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Circle} from '../circle/model';

/**
 * This file defines the properties stored in a Freet
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  circles: Types.ObjectId[];
  dateCreated: Date;
};

export type PopulatedFreet = {
  _id: Types.ObjectId;
  content: string;
  author: User;
  circles: Circle[];
  dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  circles: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Circle'
  }],
  dateCreated: {
    type: Date,
    required: true
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
