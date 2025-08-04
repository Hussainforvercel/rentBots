import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';

import { ListBlockedDates } from '../../data/models';
import DateAvailabilityType from '../types/DateAvailabilityType';

const DateAvailability = {

  type: DateAvailabilityType,

  args: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
  },

  async resolve({ request, response }, { listId, startDate, endDate }) {

    let convertStart = moment(startDate).format('YYYY-MM-DD');
    let convertEnd = moment(endDate).format('YYYY-MM-DD');
    const checkAvailableDates = await ListBlockedDates.findAll({
      where: {
        listId,
        blockedDates: {
          $between: [convertStart + " 00:00:00", convertEnd + " 23:59:59"]
        }
      },
      raw: true
    });
    const isBlocked = checkAvailableDates && checkAvailableDates.length > 0 ? checkAvailableDates.filter(o => o.calendarStatus == "blocked") : [];
    return {
      status: isBlocked && isBlocked.length > 0 ? "NotAvailable" : "Available"
    }
  },
};

export default DateAvailability;
