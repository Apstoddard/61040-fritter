import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Circle} from '../circle/model';

type CircleResponse = {
  _id: string;
  authorId: string;
  title: string;
  bio: string;
  category: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Circle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Circle>} circle - A circle
 * @returns {CircleResponse} - The circle object formatted for the frontend
 */
const constructCircleResponse = (circle: HydratedDocument<Circle>): CircleResponse => {
  const circleCopy: Circle = {
    ...circle.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...circleCopy,
    _id: circleCopy._id.toString(),
    authorId: circleCopy.authorId.toString(),
    dateCreated: formatDate(circle.dateCreated)
  };
};

export {
  constructCircleResponse
};
