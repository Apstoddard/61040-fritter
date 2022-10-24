import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore circles
 * stored in MongoDB
 */
class CircleCollection {
  /**
   * Add a circle to the collection
   *
   * @param {string} title - The title of the circle
   * @param {string} bio - The description of the circle
   * @param {string} category - The category of the circle
   * @param {string} author - The id of the author of the circle
   *
   * @return {Promise<HydratedDocument<Circle>>} - The newly created circle
   */
  static async addOne(title: string, bio: string, category: string, author: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const date = new Date();
    const circle = new CircleModel({
      title,
      bio,
      dateCreated: date,
      category,
      author
    });
    await circle.save();
    return circle.populate('author');
  }

  /**
   * Find a circle by circleId
   *
   * @param {string} circleId - The id of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with the given circleId, if any
   */
  static async findOne(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({_id: circleId}).populate('author');
  }

  /**
   * Find a circle by title
   *
   * @param {string} title - The title of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with the given title, if any
   */
  static async findOneByTitle(title: string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({title}).populate('author');
  }

  /**
   * Get all the circles in the database
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({}).sort({dateCreated: -1}).populate('author');
  }

  /**
   * Get all the circles created by given author
   *
   * @param {string} username - The username of author of a circle
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles by a user
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CircleModel.find({author: author._id}).populate('author');
  }

  /**
   * Get all the circles in a given category
   *
   * @param {string} category - The category of a circle
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles in the category
   */
  static async findAllByCategory(category: string): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({category}).populate('author');
  }

  /**
   * Update a circle with a new bio
   *
   * @param {string} circle - The id of the circle to be updated
   * @param {string} bio - The new bio of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async updateOneBio(circleId: Types.ObjectId | string, bio: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    circle.bio = bio;
    await circle.save();
    return circle.populate('author');
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
   * @param {string} author - The id of author of the circle
   */
  static async deleteMany(author: Types.ObjectId | string): Promise<void> {
    await CircleModel.deleteMany({author});
  }
}

export default CircleCollection;
