import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as circleValidator from '../circle/middleware';
import * as subscribeValidator from '../subscribe/middleware';
import * as util from './util';
import FollowCollection from './collection';
import SubscribeCollection from './collection';

const router = express.Router();

/**
 * Get all the subscriptions a user has
 *
 * @name GET /api/subscribes?user=username
 *
 * @return {SubscribeResponse[]} - An array of subscribes
 * @throws {400} - If username is not given
 * @throws {404} - If username not a user
 *
 */
/**
 * Get all of a circle's subscribers
 *
 * @name GET /api/subscribes?circleId=circleId
 *
 * @return {SubscribeResponse[]} - An array of subscribes
 * @throws {400} - If circleId is not given
 * @throws {404} - If circleId not a circle
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.user) {
      next();
    } else if (req.query.circleId) {
      next('route');
    } else {
      res.status(400).json({
        error: 'A query parameter must be specified.'
      });
    }
  },
  [
    userValidator.isQueryUserExist
  ],
  async (req: Request, res: Response) => {
    const subscriptions = await SubscribeCollection.findAllSubscriptionsByUsername(req.query.user as string);
    const response = subscriptions.map(util.constructSubscribeResponse);
    res.status(200).json(response);
  }
);

router.get(
  '/',
  [
    circleValidator.isQueryCircleExists
  ],
  async (req: Request, res: Response) => {
    const subscriptions = await SubscribeCollection.findAllSubscribersByCircle(req.query.circleId as string);
    const response = subscriptions.map(util.constructSubscribeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new subscription.
 *
 * @name POST /api/subscribes
 *
 * @param {string} circleId - The circle to follow
 * @return {SubscribeResponse} - The created subscribe
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isBodyCircleExists,
    subscribeValidator.isNewSubscribe
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const subscribe = await SubscribeCollection.addOne(userId, req.body.circleId);

    res.status(201).json({
      message: 'Your subscription was created successfully.',
      subscribe: util.constructSubscribeResponse(subscribe)
    });
  }
);

/**
 * Delete a subscription
 *
 * @name DELETE /api/subscribes/:circleId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the subscribe
 * @throws {404} - If the subscribe does not exist
 */
router.delete(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    subscribeValidator.isSubscribeExists
  ],
  async (req: Request, res: Response) => {
    await SubscribeCollection.deleteOne(req.session.userId, req.params.circleId);
    res.status(200).json({
      message: 'Your subscribe was deleted successfully.'
    });
  }
);

export {router as subscribeRouter};
