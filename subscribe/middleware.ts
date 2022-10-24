import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import SubscribeCollection from '../subscribe/collection';

/**
 * Checks if a subscription with userId and circleId in req.params exists
 */
const isSubscribeExists = async (req: Request, res: Response, next: NextFunction) => {
  const circleValidFormat = Types.ObjectId.isValid(req.params.circleId);
  const subscribe = circleValidFormat ? await SubscribeCollection.findOne(req.session.userId, req.params.circleId) : '';
  if (!subscribe) {
    res.status(404).json({
      error: {
        subscribeNotFound: `Subscription from user ID ${req.session.userId as string} to circle ID ${req.params.circleId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a subscription with userId and circleId in req.params does not yet exist
 */
const isNewSubscribe = async (req: Request, res: Response, next: NextFunction) => {
  const circleValidFormat = Types.ObjectId.isValid(req.body.circleId);
  const subscribe = circleValidFormat ? await SubscribeCollection.findOne(req.session.userId, req.body.circleId) : '';
  if (subscribe) {
    res.status(403).json({
      error: {
        error: 'Can not subscribed to an already subscribed circle.'
      }
    });
    return;
  }

  next();
};

export {
  isSubscribeExists,
  isNewSubscribe
};
