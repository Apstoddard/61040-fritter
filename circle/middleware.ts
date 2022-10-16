import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CircleCollection from '../circle/collection';

/**
 * Checks if a circle with circleId in req.params exists
 */
const isCircleExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.circleId);
  const circle = validFormat ? await CircleCollection.findOne(req.params.circleId) : '';
  if (!circle) {
    res.status(404).json({
      error: {
        circleNotFound: `Circle with circle ID ${req.params.circleId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the circle whose circleId is in req.params
 */
const isValidCircleModifier = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findOne(req.params.circleId);
  const userId = circle.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' circles.'
    });
    return;
  }

  next();
};

export {
  isCircleExists,
  isValidCircleModifier
};
