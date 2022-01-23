import moment from 'moment';

export const parseItem = (item) => {
  return {
    ...item,
    MatchDate: moment(item.MatchDate, moment.ISO_8601).add(9, 'hours').toDate(),
  };
};
