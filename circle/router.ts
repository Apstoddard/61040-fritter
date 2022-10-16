import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CircleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as circleValidator from '../circle/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the circles
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse[]} - A list of all the circles sorted in descending
 *                      order by date created
 */
/**
 * Get circles by author.
 *
 * @name GET /api/circles?author=id
 *
 * @return {CircleResponse[]} - An array of circles created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allCircles = await CircleCollection.findAll();
    const response = allCircles.map(util.constructCircleResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorCircles = await CircleCollection.findAllByUsername(req.query.author as string);
    const response = authorCircles.map(util.constructCircleResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new circle.
 *
 * @name POST /api/circles
 *
 * @param {string} title - The title of the circle
 * @param {string} bio - The bio of the circle
 * @param {string} category - The category of the circle
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const circle = await CircleCollection.addOne(userId, req.body.title, req.body.bio, req.body.category);

    res.status(201).json({
      message: 'Your circle was created successfully.',
      circle: util.constructCircleResponse(circle)
    });
  }
);

/**
 * Delete a circle
 *
 * @name DELETE /api/circles/:circleId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the circle
 * @throws {404} - If the circleId is not valid
 */
router.delete(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteOne(req.params.circleId);
    res.status(200).json({
      message: 'Your circle was deleted successfully.'
    });
  }
);

/**
 * Modify a circle
 *
 * @name PUT /api/circles/:circleId
 *
 * @param {string} bio - the new bio for the circle
 * @return {CircleResponse} - the updated circle
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the circle
 * @throws {404} - If the circleId is not valid
 */
router.put(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier,
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.updateOne(req.params.circleId, req.body.bio);
    res.status(200).json({
      message: 'Your circle was updated successfully.',
      circle: util.constructCircleResponse(circle)
    });
  }
);

export {router as circleRouter};
