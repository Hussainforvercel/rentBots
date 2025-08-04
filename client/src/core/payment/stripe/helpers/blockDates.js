import moment from 'moment';
import sequelize from 'sequelize';
import { Reservation, ListBlockedDates } from '../../../../data/models';
import { utcDateFormat, dateFormat } from '../../../../helpers/dayDifferenceHelper';

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

      day = await dateFormat(blockedDates);
      let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

      let blockedDatesFind = await ListBlockedDates.findAll({
        where: {
          blockedDates: dayList,
          listId: reservation.listId,
          calendarStatus: 'available'
        }
      });

      let blockfindDates, createdDates, updateDates;
      let chooseDates = moment(moment(blockedDates)).format('YYYY-MM-DD');

      blockedDatesFind.map(async (value, keys) => {
        blockfindDates = moment(value.blockedDates).format('YYYY-MM-DD');
        if (chooseDates == blockfindDates) {
          updateDates = await ListBlockedDates.update({
            listId: reservation.listId,
            blockedDates: blockedDates,
            calendarStatus: 'blocked',
            reservationId,
          },
            {
              where: {
                listId: reservation.listId,
                blockedDates: dayList
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

    // dates.map(async (blockedDates) => {
    //   await ListBlockedDates.findOrCreate({
    //     where: {
    //       listId: reservation.listId,
    //       reservationId,
    //       blockedDates
    //     },
    //     defaults: {
    //       //properties you want on create
    //       listId: reservation.listId,
    //       reservationId,
    //       blockedDates
    //     }
    //   });
    // });    
  }
}