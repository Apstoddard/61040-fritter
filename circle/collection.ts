import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore circles
 * stored in MongoDB, including adding, finding, updating, and deleting circles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in Circle. https://mongoosejs.com/docs/typescript.html
 */
class CircleCollection {
  /**
   * Add a circle to the collection
   *
   * @param {string} authorId - The id of the author of the circle
   * @param {string} title - The title of the circle
   * @param {string} bio - The description of the circle
   * @param {string} category - The category of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, title: string, bio: string, category: string): Promise<HydratedDocument<Circle>> {
    const date = new Date();
    const circle = new CircleModel({
      authorId,
      title,
      bio,
      category,
      dateCreated: date
    });
    await circle.save(); // Saves circle to MongoDB
    return circle.populate('authorId');
  }

  /**
   * Find a circle by circleId
   *
   * @param {string} circleId - The id of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with the given circleId, if any
   */
  static async findOne(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({_id: circleId}).populate('authorId');
  }

  /**
   * Get all the circles in the database
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    // Retrieves circles and sorts them from most to least recent
    return CircleModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the circles created by given author
   *
   * @param {string} username - The username of author of a circle
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CircleModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a circle with anew bio
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} bio - The new bio of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async updateOne(circleId: Types.ObjectId | string, bio: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    circle.bio = bio;
    await circle.save();
    return circle.populate('authorId');
  }

  /**
   * Delete a circle with given circleId.
   *
   * @param {string} circleId - The circleId of circle to delete
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(circleId: Types.ObjectId | string): Promise<boolean> {
    const circle = await CircleModel.deleteOne({_id: circleId});
    return circle !== null;
  }

  /**
   * Delete all the circles by the given author
   *
   * @param {string} authorId - The id of author of the circle
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CircleModel.deleteMany({authorId});
  }
}

export default CircleCollection;
