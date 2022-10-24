import type {HydratedDocument, Types} from 'mongoose';
import type {Subscribe} from './model';
import SubscribeModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore subscriptions
 * stored in MongoDB
 */
class SubscribeCollection {
  /**
   * Add a subscription to the collection
   *
   * @param {string} user - The user subscribing
   * @param {string} circle - The circle being subscribed to
   * @return {Promise<HydratedDocument<Subscribe>>} - The newly created Follow
   */
  static async addOne(user: Types.ObjectId | string, circle: Types.ObjectId | string): Promise<HydratedDocument<Subscribe>> {
    const date = new Date();
    const subscribe = new SubscribeModel({
      user,
      circle,
      dateSubscribed: date
    });
    await subscribe.save();
    await subscribe.populate('user');
    return subscribe.populate('circle');
  }

  /**
   * Find a subscribe by userId and followingId
   *
   * @param {string} userId - The id of the user
   * @param {string} circleId - The id of the circle they are following
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The subscribe
   */
  static async findOne(userId: Types.ObjectId | string, circleId: Types.ObjectId | string): Promise<HydratedDocument<Subscribe>> {
    return SubscribeModel.findOne({user: userId, circle: circleId}).populate('user').populate('circle');
  }

  /**
   * Get all the circles a user is subscribed to
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the subscribes that that user created
   */
  static async findAllSubscriptionsByUsername(username: string): Promise<Array<HydratedDocument<Subscribe>>> {
    const user = await UserCollection.findOneByUsername(username);
    return SubscribeModel.find({user: user._id}).populate('user').populate('circle');
  }

  /**
   * Get all the subscribers of a circle
   *
   * @param {string} circle - The id of the circle
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of subscribes that subscribe to the circle
   */
  static async findAllSubscribersByCircle(circle: Types.ObjectId | string): Promise<Array<HydratedDocument<Subscribe>>> {
    return SubscribeModel.find({circle}).populate('user').populate('circle');
  }

  /**
   * Delete a subscription with given user and circle.
   *
   * @param {string} user - The user
   * @param {string} circle - The circle
   * @return {Promise<Boolean>} - true if the subscribe has been deleted, false otherwise
   */
  static async deleteOne(user: Types.ObjectId | string, circle: Types.ObjectId | string): Promise<boolean> {
    const subscribe = await SubscribeModel.deleteOne({user, circle});
    return subscribe !== null;
  }

  /**
   * Delete all subscriptions with a given user
   *
   * @param {string} user - The user to delete all subscriptions from
   */
  static async deleteManyByUser(user: Types.ObjectId | string): Promise<void> {
    await SubscribeModel.deleteMany({user});
  }

  /**
   * Delete all subscriptions to a given circle
   *
   * @param {string} circle - The circle to delete all subscriptions to
   */
  static async deleteManyByCircle(circle: Types.ObjectId | string): Promise<void> {
    await SubscribeModel.deleteMany({circle});
  }
}

export default SubscribeCollection;
