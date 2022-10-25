import CircleCollection from '../circle/collection';
import FollowCollection from '../follow/collection';
import FreetCollection from '../freet/collection';
import LikeCollection from '../like/collection';
import SubscribeCollection from '../subscribe/collection';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} first_name - The username of the user
   * @param {string} last_name - The password of the user
   * @param {string} email - The password of the user
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(first_name: string, last_name: string, email: string, username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    const bio = '';

    const user = new UserModel({first_name, last_name, email, username, bio, password, dateJoined});
    await user.save();
    return user;
  }

  /**
   * Find all users
   *
   * @return {Promise<Array<HydratedDocument<User>>>} - Array of all users
   */
  static async findAll(): Promise<Array<HydratedDocument<User>>> {
    return UserModel.find({});
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username?.trim()}$`, 'i')});
  }

  /**
   * Find a user by email.
   *
   * @param {string} email - The email of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmail(email: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({email});
  }

  /**
   * Find a user by username (case insensitive) and password.
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.first_name) {
      user.first_name = userDetails.first_name as string;
    }

    if (userDetails.last_name) {
      user.last_name = userDetails.last_name as string;
    }

    if (userDetails.email) {
      user.email = userDetails.email as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    if (userDetails.bio !== undefined) {
      user.bio = userDetails.bio as string;
    }

    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    await FreetCollection.deleteMany(userId);
    await CircleCollection.deleteMany(userId);
    await LikeCollection.deleteManyByUser(userId);
    await FollowCollection.deleteMany(userId);
    await SubscribeCollection.deleteManyByUser(userId);
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
