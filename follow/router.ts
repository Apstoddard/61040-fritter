import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import FollowCollection from './collection';

const router = express.Router();

/**
 * Get all the users that a user follows
 *
 * @name GET /api/follows?following=username
 *
 * @return {FollowResponse[]} - An array of follows
 * @throws {400} - If username is not given
 * @throws {404} - If username not a user
 *
 */
/**
 * Get all of a user's followers
 *
 * @name GET /api/follows?followers=username
 *
 * @return {FollowResponse[]} - An array of follows
 * @throws {400} - If username is not given
 * @throws {404} - If username not a user
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.following) {
      next();
    } else if (req.query.followers) {
      next('route');
    } else {
      res.status(400).json({
        error: 'A query parameter must be specified.'
      });
    }
  },
  [
    userValidator.isFollowingExists
  ],
  async (req: Request, res: Response) => {
    const following = await FollowCollection.findAllFollowingByUsername(req.query.following as string);
    const response = following.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

router.get(
  '/',
  [
    userValidator.isFollowersExists
  ],
  async (req: Request, res: Response) => {
    const followers = await FollowCollection.findAllFollowersByUsername(req.query.followers as string);
    const response = followers.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new follow.
 *
 * @name POST /api/follows
 *
 * @param {string} user - The user to follow
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isBodyUserExist,
    followValidator.isNewFollow
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const follow = await FollowCollection.addOne(userId, req.body.user);

    res.status(201).json({
      message: 'Your follow was created successfully.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follows/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the follow
 * @throws {404} - If the follow does not exist
 */
router.delete(
  '/:user?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExist,
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.deleteOne(req.session.userId, req.params.user);
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);

export {router as followRouter};
