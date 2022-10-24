import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from '../like/model';

type LikeResponse = {
  _id: string;
  user: string;
  freet: string;
  dateLiked: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = likeCopy.user;
  delete likeCopy.user;
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    user: username,
    freet: likeCopy.freet._id.toString(),
    dateLiked: formatDate(like.dateLiked)
  };
};

export {
  constructLikeResponse
};
