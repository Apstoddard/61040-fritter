import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from '../follow/collection';

/**
 * Checks if a follow with userId and user in req.params does not exist yet
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const follow = await FollowCollection.findOne(req.session.userId, req.params.user);
  if (!follow) {
    res.status(404).json({
      error: {
        followNotFound: `Follow from user ID ${req.session.userId as string} to user ${req.params.user} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a follow with userId and user in req.params does not exist yet
 */
const isNewFollow = async (req: Request, res: Response, next: NextFunction) => {
  const follow = await FollowCollection.findOne(req.session.userId, req.body.user);
  if (follow) {
    res.status(403).json({
      error: {
        error: 'Can not follow an already followed user.'
      }
    });
    return;
  }

  next();
};

export {
  isFollowExists,
  isNewFollow
};
