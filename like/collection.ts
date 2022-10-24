import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB
 */
class LikeCollection {
  /**
   * Add a follow to the collection
   *
   * @param {string} user - The creator of the like
   * @param {string} freet - The freet being liked
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const date = new Date();
    const like = new LikeModel({
      user,
      freet,
      dateLiked: date
    });
    await like.save();
    await like.populate('user');
    return like.populate('freet');
  }

  /**
   * Find a like by userId and freetId
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The like
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({user: userId, freet: freetId}).populate('user').populate('freet');
  }

  /**
   * Get all the likes from a user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes that that user created
   */
  static async findAllLikesByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const user = await UserCollection.findOneByUsername(username);
    return LikeModel.find({user: user._id}).populate('user').populate('freet');
  }

  /**
   * Get all the likes for a given freet
   *
   * @param {string} freetId - The if of the freet
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of likes for a given freet
   */
  static async findAllLikesByFreet(freet: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freet}).populate('user').populate('freet');
  }

  /**
   * Delete a like from a user to a freet
   *
   * @param {string} user - The user
   * @param {string} freet - The freet
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({user, freet});
    return like !== null;
  }

  /**
   * Delete all like made by a given user
   *
   * @param {string} user - The user to delete all likes from
   */
  static async deleteManyByUser(user: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({user});
  }

  /**
   * Delete all likes on a given freet
   *
   * @param {string} freet - The freet to delete all likes from
   */
  static async deleteManyByFreet(freet: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({freet});
  }
}

export default LikeCollection;
