import type {HydratedDocument} from 'mongoose';
import {Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import LikeCollection from '../like/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} content - The content of the freet
   * @param {string} author - The author of the freet
   * @param {string[]} circles - The circles of the freet
   *
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(content: string, author: Types.ObjectId | string, circles: Types.ObjectId[] | string[]): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      content,
      author,
      circles,
      dateCreated: date
    });
    await freet.save();
    await freet.populate('author');
    return freet.populate('circles');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('author').populate('circles');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('author').populate('circles');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({author: author._id}).populate('author').populate('circles');
  }

  /**
   * Update a freet with new circles
   *
   * @param {string} circle - The id of the circle to be updated
   * @param {string} bio - The new bio of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async updateOne(freetId: Types.ObjectId | string, circleIds: [Types.ObjectId | string]): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.circles = circleIds? circleIds.map(id => new Types.ObjectId(id)) : [];
    await freet.save();
    await freet.populate('circles');
    return freet.populate('author');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    await LikeCollection.deleteManyByFreet(freetId);
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(author: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({author});
  }
}

export default FreetCollection;
