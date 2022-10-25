import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
import LikeCollection from './collection';

const router = express.Router();

/**
 * Get all the likes by freet
 *
 * @name GET /api/likes?freetId=freetId
 *
 * @return {LikeResponse[]} - An array of likes on freet freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If freetId not a valid freet
 *
 */
/**
 * Get all the likes by user
 *
 * @name GET /api/likes?author=username
 *
 * @return {LikeResponse[]} - An array of likes created by username
 * @throws {400} - If username is not given
 * @throws {404} - If username not a user
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId) {
      next();
    } else if (req.query.author) {
      next('route');
    } else {
      res.status(400).json({
        error: 'A query parameter must be specified.'
      });
    }
  },
  [
    freetValidator.isQueryFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetLikes = await LikeCollection.findAllLikesByFreet(req.query.freetId as string);
    const response = freetLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

router.get(
  '/',
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorLikes = await LikeCollection.findAllLikesByUsername(req.query.author as string);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The id of the freet to like
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in or the freet has already been liked
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isBodyFreetExists,
    likeValidator.isNewLike
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const like = await LikeCollection.addOne(userId, req.body.freetId);

    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the like
 * @throws {404} - If the like does not exist
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isLikeExists
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.session.userId, req.params.freetId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
