import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a like with userId and freetId in req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetValidFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = freetValidFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Like from user ID ${req.session.userId as string} to freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a like with userId and freetId in req.params exists
 */
const isNewLike = async (req: Request, res: Response, next: NextFunction) => {
  const freetValidFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = freetValidFormat ? await LikeCollection.findOne(req.session.userId, req.body.freetId) : '';
  if (like) {
    res.status(403).json({
      error: {
        error: 'Can not like an already liked freet.'
      }
    });
    return;
  }

  next();
};

export {
  isLikeExists,
  isNewLike
};
