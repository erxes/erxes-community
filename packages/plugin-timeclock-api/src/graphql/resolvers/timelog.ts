import { ITimeLogDocument } from '../../models/definitions/timeclock';

export default {
  user(timelog: ITimeLogDocument) {
    return (
      timelog.userId && {
        __typename: 'User',
        _id: timelog.userId
      }
    );
  }
};
