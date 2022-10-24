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
 * Checks if a circle with circleId in req.body exists
 */
const isBodyCircleExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.circleId);
  const circle = validFormat ? await CircleCollection.findOne(req.body.circleId) : '';
  if (!circle) {
    res.status(404).json({
      error: {
        circleNotFound: `Circle with circle ID ${req.body.circleId as string} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle with circleId in req.query exists
 */
const isQueryCircleExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.circleId as string);
  const circle = validFormat ? await CircleCollection.findOne(req.query.circleId as string) : '';
  if (!circle) {
    res.status(404).json({
      error: {
        circleNotFound: `Circle with circle ID ${req.query.circleId as string} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle title in req.body is already in use
 */
const isCircleTitleNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findOneByTitle(req.body.title);

  if (!circle) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: 'A circle with this name already exists.'
    }
  });
};

/**
 * Checks if a category in req.query exists
 */
const isCategoryExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.category === undefined) {
    next();
    return;
  }

  if (!req.query.category) {
    res.status(400).json({
      error: 'Provided category must be nonempty.'
    });
    return;
  }

  const circles = await CircleCollection.findAllByCategory(req.query.category as string);
  if (circles.length === 0) {
    res.status(404).json({
      error: `Category ${req.query.category as string} does not exist.`
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
  const userId = circle.author._id;
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
  isBodyCircleExists,
  isQueryCircleExists,
  isCircleTitleNotAlreadyInUse,
  isCategoryExists,
  isValidCircleModifier
};
