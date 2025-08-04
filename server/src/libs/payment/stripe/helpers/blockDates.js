import sequelize from 'sequelize';
// import { Reservation, ListBlockedDates } from '../../../../data/models';
import Reservation from '../../../../data/models/Reservation.js';
import ListBlockedDates from '../../../../data/models/ListBlockedDates.js';
import { momentFormat, nestedMomentFormatter } from '../../../../helpers/momentHelper.js';
import { utcDateFormat, dateFormat } from '../../../../helpers/dayDifferenceHelper.js';

export async function blockDates(reservationId) {
  let currentDate, day, dates = [], start, end;
  const reservation = await Reservation.findOne({
    where: {
      id: reservationId,
    }
  });

  if (reservation) {
    start = await utcDateFormat(reservation.checkIn);
    end = await utcDateFormat(reservation.checkOut);
    currentDate = new Date(start);
    while (start <= end) {
      dates.push(start);
      currentDate.setDate(currentDate.getDate() + 1);
      start = await dateFormat(currentDate);
    }

    dates.map(async (blockedDates) => {

      day = momentFormat(blockedDates, 'YYYY-MM-DD');

      let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

      let blockedDatesFind = await ListBlockedDates.findAll({
        where: {
          blockedDates: dayList,
          listId: reservation.listId,
          calendarStatus: 'available'
        }
      });

      let blockfindDates, createdDates, updateDates;
      let chooseDates = nestedMomentFormatter(blockedDates);

      blockedDatesFind.map(async (value, keys) => {
        blockfindDates = momentFormat(value.blockedDates, 'YYYY-MM-DD');
        if (chooseDates == blockfindDates) {

          // let formattedDate = moment(moment(blockedDates)).format('YYYY-MM-DD')
          let convertStartDate = new Date(blockedDates);
          convertStartDate.setHours(0, 0, 0, 0);

          let convertEndDate = new Date(blockedDates);
          convertEndDate.setHours(23, 59, 59, 999);
          updateDates = await ListBlockedDates.update({
            listId: reservation.listId,
            blockedDates: blockedDates,
            calendarStatus: 'blocked',
            reservationId,
          },
            {
              where: {
                listId: reservation.listId,
                blockedDates: {
                  $between: [
                    convertStartDate, convertEndDate
                  ]
                }
              }
            });


        } else {

          createdDates = await ListBlockedDates.create({
            listId: reservation.listId,
            blockedDates: blockedDates,
            calendarStatus: 'blocked',
            reservationId
          });
        }


      });

      if (blockedDatesFind.length == 0) {
        createdDates = await ListBlockedDates.create({
          listId: reservation.listId,
          blockedDates: blockedDates,
          calendarStatus: 'blocked',
          reservationId
        });
      }

    });

  }
}