import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB
 */
class FollowCollection {
  /**
   * Add a follow to the collection
   *
   * @param {string} user - The user following
   * @param {string} following - The user being followed
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
  static async addOne(user: Types.ObjectId | string, followingName: string): Promise<HydratedDocument<Follow>> {
    const date = new Date();
    const following = await UserCollection.findOneByUsername(followingName);
    const follow = new FollowModel({
      dateFollowed: date,
      user,
      following: following._id
    });
    await follow.save();
    await follow.populate('user');
    return follow.populate('following');
  }

  /**
   * Find a follow by userId and followingId
   *
   * @param {string} userId - The id of the user
   * @param {string} followingId - The id of the user they are following
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow
   */
  static async findOne(userId: Types.ObjectId | string, followingName: string): Promise<HydratedDocument<Follow>> {
    const following = await UserCollection.findOneByUsername(followingName);
    console.log(following);
    return FollowModel.findOne({user: userId, following: following._id}).populate('user').populate('following');
  }

  /**
   * Get all the users a user is following
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows that that user created
   */
  static async findAllFollowingByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({user: user._id}).populate('user').populate('following');
  }

  /**
   * Get all the followers of a user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows that follow that user
   */
  static async findAllFollowersByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({following: user._id}).populate('user').populate('following');
  }

  /**
   * Delete a follow with given user and following.
   *
   * @param {string} user - The user following
   * @param {string} following - The user being followed
   * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
   */
  static async deleteOne(user: Types.ObjectId | string, followingName: string): Promise<boolean> {
    const following = await UserCollection.findOneByUsername(followingName);
    const follow = await FollowModel.deleteOne({user, following: following._id});
    return follow !== null;
  }

  /**
   * Delete all follows with a given user
   *
   * @param {string} user - The user to delete all follows with
   */
  static async deleteMany(user: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({user});
    await FollowModel.deleteMany({following: user});
  }
}

export default FollowCollection;
