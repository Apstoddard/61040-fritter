import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Subscribe, PopulatedSubscribe} from '../subscribe/model';

type SubscribeResponse = {
  _id: string;
  user: string;
  circle: string;
  dateSubscribed: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Subscribe object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Subscribe>} subscribe - A subscribe
 * @returns {SubscribeResponse} - The subscribe object formatted for the frontend
 */
const constructSubscribeResponse = (subscribe: HydratedDocument<Subscribe>): SubscribeResponse => {
  const subscribeCopy: PopulatedSubscribe = {
    ...subscribe.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = subscribeCopy.user;
  const {title} = subscribeCopy.circle;
  delete subscribeCopy.user;
  delete subscribeCopy.circle;

  return {
    ...subscribeCopy,
    _id: subscribeCopy._id.toString(),
    user: username,
    circle: title,
    dateSubscribed: formatDate(subscribe.dateSubscribed)
  };
};

export {
  constructSubscribeResponse
};
