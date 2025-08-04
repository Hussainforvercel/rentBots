import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import { ListBlockedDates } from '../../../data/models/ListBlockedDates.js';
import DateAvailabilityType from '../../types/DateAvailabilityType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { momentFormat } from '../../../helpers/momentHelper.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const dateAvailability = {
  type: DateAvailabilityType,
  args: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
  },
  async resolve({ request, response }, { listId, startDate, endDate }) {

    try {
      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      // const checkAvailableDates = await sequelize.query(`select * from ListBlockedDates where blockedDates BETWEEN NOW() AND last_day(now()) + interval 1 day + interval 6 month AND listId='${listId}';`);
      let dateType, start, end, checkDate, setBlockedDates = [],
        getMonthList = [], finalRecord = [], record = [], monthArray = [];
      start = new Date(startDate);
      end = new Date(endDate);
      const checkAvailableDates = await ListBlockedDates.findAll({
        where: {
          listId,
          blockedDates: {
            $lte: endDate,
            $gte: startDate
          },
        },
      });

      if (checkAvailableDates) {
        checkAvailableDates.map((item, index) => {
          setBlockedDates.push(item.blockedDates);
        });
        setBlockedDates.sort(function (a, b) {
          return new Date(a) - new Date(b);
        });
        setBlockedDates.map((item, index) => {
          dateType = new Date(item);
          getMonthList.push(dateType.getMonth());
        });

        while (start <= end) {
          monthArray.push(new Date(start));
          start.setMonth(start.getMonth() + 1);
        }
        monthArray.map((item, index) => {
          checkDate = new Date(item).getMonth();
          setBlockedDates.map((dateItem, dateIndex) => {
            dateType = new Date(dateItem);
            if (checkDate == dateType.getMonth()) {
              record.push(momentFormat(dateItem, "YYYY-MM-DD"));
            }
          });
          finalRecord.push(record);
          record = [];
        });
        finalRecord = finalRecord.filter(function (e) { return e });
        return {
          results: finalRecord,
          status: 200
        }
      } else {
        return {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
        }
      }
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default dateAvailability;
